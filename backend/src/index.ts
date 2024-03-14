import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import {
  favorite,
  forecast,
  getUser,
  login,
  logout,
  register,
} from "./controllers/user.js";
import {
  autocompleteLocation,
  currentConditions,
  getLocation,
} from "./controllers/weather.js";
import { setRedisKeyExpiry } from "./helpers.js";
import session from "./middlewares/session.js";
export { redis } from "./redis.js";
export { db } from "./database.js";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.post("/favorite/:cityKey", session, favorite);
app.delete("/favorite/:cityKey", favorite);
app.get("/location", getLocation);
app.get("/search", autocompleteLocation);
app.get("/current-conditions", currentConditions);
app.get("/forecast", forecast);
app.get("/user", session, getUser);
app.post("/login", session, login);
app.post("/register", register);
app.get("/logout", session, logout);

setRedisKeyExpiry();

app.listen(3000, () => console.log("Server running on port 3000"));
