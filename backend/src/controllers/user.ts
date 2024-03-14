import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { IronSession } from "iron-session";
import { db } from "../index.js";
import { createCachedHandler } from "../helpers.js";
import { DWSession } from "../middlewares/session.js";
import { users } from "../schema/schema.js";

export async function getUser(req: Request, res: Response) {
  const session = res.locals.session;
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
  return res.status(200).json({ message: "Please login" });
}
export async function login(req: Request, res: Response) {
  const { password, username } = req.body;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  const { session } = res.locals;
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

export async function register(req: Request, res: Response) {
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
export async function favorite(req: Request, res: Response) {
  const session = res.locals.session;
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
export async function logout(req: Request, res: Response) {
  const session = res.locals.session;
  if (session) {
    session.destroy();
    await session.save();
  }
  return res.json({ message: "Goodbye" });
}
export const forecast = createCachedHandler(
  "forecast",
  query =>
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${query}?apikey=${process.env.ACCUWEATHER_API_KEY}&metric=true`
);
