import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import {
  addFavorite,
  createUser,
  getUserByUsername,
  removeFavorite,
} from "../schema/schema.js";

export async function getUser(req: Request, res: Response) {
  const session = res.locals.session;
  if (session.username) {
    const user = await getUserByUsername(session.username);
    if (user) {
      return res.status(200).json({
        user: {
          username: user.username,
          favorites: user.favorites 
        },
      });
    }
  }
  await session.destroy();
  return res.status(200).json({ message: "Please login" });
}

export async function login(req: Request, res: Response) {
  const { password, username } = req.body;
  const user = await getUserByUsername(username);
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
  const user = await getUserByUsername(username);
  if (user) {
    return res.status(400).json({ message: "Username is already taken" });
  }
  const hash = await bcrypt.hash(password, saltRounds);
  // TODO: Handle error
  await createUser(username, hash);
  return res.status(200).json({ message: "User registered" });
}

export async function favorite(req: Request, res: Response) {
  const session = res.locals.session;
  if (!session.username) {
    return res.status(401).json({ message: "Please login" });
  }
  const cityKey = req.params.cityKey;
  const user = await getUserByUsername(session.username);
  if (user) {
    if (req.method === "POST") {
      if (!user.favorites?.includes(cityKey)) {
        await addFavorite(user, cityKey);
        return res.json({ message: "Favorite added" });
      }
    } else if (req.method === "DELETE") {
      await removeFavorite(user, cityKey);
      return res.json({ message: "Favorite removed" });
    }
    return res.status(400).json({ message: "Favorite already exists" });
  }
  return res.status(400).json({ message: "User not found" });
}

export async function logout(req: Request, res: Response) {
  const session = res.locals.session;
  if (session) {
    session.destroy();
    await session.save();
  }
  return res.json({ message: "Goodbye" });
}
