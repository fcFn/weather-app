import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import type { Request, Response } from "express";
import express from "express";
import { IronSession, getIronSession } from "iron-session";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "redis";
import { users } from "./schema/schema.js";

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

const redis = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", err => console.log("Redis Client Error", err))
  .connect();

interface DWSession {
  username: string;
}
app.get("/user", user);
app.post("/login", login);
app.post("/register", register);
app.get("/logout", logout);

const connectionString = process.env.DATABASE_URL ?? "";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

app.listen(3000, () => console.log("Server running on port 3000"));

async function login(req: Request, res: Response) {
  const session = await getSession(req, res);
  const { password, username } = req.body;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      session.username = username;
      await session.save();
      return res
        .status(200)
        .json({ message: "OK", user: { username, isLoggedIn: true } });
    }
  }
  await session.destroy();
  res.status(401).json({ message: "Incorrect username or password!" });
}

async function user(req: Request, res: Response) {
  const session = await getSession(req, res);
  if (session.username) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, session.username));
    if (user) {
      return res.status(200).json({
        user: {
          username: user.username,
          favorites: JSON.parse(user.favorites || "[]"),
        },
      });
    }
  }
  await session.destroy();
  return res.status(401).json({ message: "Please login" });
}
function getSession(req: Request, res: Response<any, Record<string, any>>) {
  return getIronSession<DWSession>(req, res, {
    password: process.env.IRON_SESSION_PASS ?? "",
    cookieName: "session",
    cookieOptions:
      process.env?.APP_ENV === "dev"
        ? { secure: false, sameSite: "lax" }
        : { secure: true, path: "/", sameSite: "none" },
  });
}

async function register(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const saltRounds = 10;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  if (user) {
    return res.status(400).json({ message: "Username is already taken" });
  }
  const hash = await bcrypt.hash(password, saltRounds);
  // TODO: Handle error
  await db.insert(users).values({
    username,
    password: hash,
  });
  return res.status(200).json({ message: "User registered" });
}

function createCachedHandler(
  redisKey: string,
  url: string | ((query: string) => string),
  transformResponse?: (result: any) => any
) {
  return async (req: Request, res: Response) => {
    const query = (req.query.q as string).toLowerCase();
    if (query === "" || typeof query !== "string") {
      return res.status(400).json({ message: "Missing query" });
    }
    const cached = await redis.hGet(redisKey, query);
    let result;
    if (!cached) {
      const response = await (
        await fetch(typeof url === "function" ? url(query) : url)
      ).json();
      result = response;
      if (transformResponse) {
        result = transformResponse(result);
      }
      await redis.hSet(redisKey, query, JSON.stringify(result));
    } else {
      result = JSON.parse(cached);
    }
    return res.json(result);
  };
}

const autocompleteLocation = createCachedHandler(
  "search",
  query =>
    `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${query}`,
  (result: any) =>
    result.map((item: any) => ({
      key: item.Key,
      country: item.Country.LocalizedName,
      city: item.LocalizedName,
    }))
);

const currentConditions = createCachedHandler(
  "current",
  query =>
    `https://dataservice.accuweather.com/currentconditions/v1/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}`,
  (result: any) => result[0]
);
const forecast = createCachedHandler(
  "forecast",
  query =>
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}&metric=true`
);
async function logout(req: Request, res: Response) {
  const session = await getSession(req, res);
  if (session) {
    session.destroy();
    await session.save();
  }
  return res.json({ message: "Goodbye" });
}
const getLocation = createCachedHandler(
  "location",
  query =>
    `https://dataservice.accuweather.com/locations/v1/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}`
);
// Gets the user from the session and adds the city key from the param route (e.g. favorite/123) to the postgresq database
app.post("/favorite/:cityKey", favorite());
app.delete("/favorite/:cityKey", favorite());
app.get("/location", getLocation);
app.get("/search", autocompleteLocation);
app.get("/current-conditions", currentConditions);
app.get("/forecast", forecast);
function favorite() {
  return async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    if (!session.username) {
      return res.status(401).json({ message: "Please login" });
    }
    const cityKey = req.params.cityKey;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, session.username));
    if (user) {
      let favorites = user.favorites ? JSON.parse(user.favorites) : [];
      if (req.method === "POST") {
        if (!favorites?.includes(cityKey)) {
          return await addFavorite(favorites, cityKey, session, res);
        }
      } else if (req.method === "DELETE") {
        return await removeFavorite(favorites, cityKey, session, res);
      }
      return res.status(400).json({ message: "Favorite already exists" });
    }
    return res.status(400).json({ message: "User not found" });
  };
}

async function addFavorite(
  favorites: any,
  cityKey: any,
  session: IronSession<DWSession>,
  res: Response
) {
  await db
    .update(users)
    .set({ favorites: JSON.stringify([...favorites, cityKey]) })
    .where(eq(users.username, session.username));
  return res.status(200).json({ message: "Favorite added" });
}

async function removeFavorite(
  favorites: any,
  cityKey: any,
  session: IronSession<DWSession>,
  res: any
) {
  await db
    .update(users)
    .set({
      favorites: JSON.stringify(
        favorites.filter((item: any) => item !== cityKey)
      ),
    })
    .where(eq(users.username, session.username));
  return res.status(200).json({ message: "Favorite removed" });
}

// Expire the cache after 24 hours
// (except location and city search suggestions that are cached forever)
await redis.expire("forecast", 60 * 60 * 24);
await redis.expire("current", 60 * 60 * 24);
