import { eq } from "drizzle-orm";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { db } from "../database.js";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  favorites: varchar("favorites").default("[]").notNull(),
});

interface User {
  id: number;
  username: string;
  password: string;
  favorites: string[];
}

export async function getUserByUsername(username: string): Promise<User | null>{
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return user ? {
    ...user,
    favorites: JSON.parse(user.favorites ?? "[]") as string[],
  } : null;
}

export async function createUser(username: string, hash: string) {
  return await db.insert(users).values({
    username,
    password: hash,
  });
}
export async function addFavorite(
  user: User,
  cityKey: string
) {
  await db
    .update(users)
    .set({ favorites: JSON.stringify([user.favorites, cityKey]) })
    .where(eq(users.username, user.username));
}
export async function removeFavorite(
  user: User,
  cityKey: string
) {
  await db
    .update(users)
    .set({
      favorites: JSON.stringify(
        user.favorites.filter((item: any) => item !== cityKey)
      ),
    })
    .where(eq(users.username, user.username));
}
