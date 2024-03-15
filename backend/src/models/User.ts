import { users } from "../schema/schema.js"

import { eq, ne } from "drizzle-orm"
import { db } from "../database.js"

export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public favorites: string[],
  ) {}
  public async addFavorite(cityKey: string) {
    await db
      .update(users)
      .set({ favorites: JSON.stringify([this.favorites, cityKey]) })
      .where(eq(users.id, this.id))
  }
  public async removeFavorite(cityKey: string) {
    await db
      .update(users)
      .set({
        favorites: JSON.stringify(this.favorites.filter((item: any) => item !== cityKey)),
      })
      .where(eq(users.id, this.id))
  }

  public static async createUser(username: string, hash: string) {
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hash,
      })
      .returning({
        id: users.id,
        username: users.username,
        password: users.password,
      })
    return new User(user.id, user.username, user.password, [])
  }

  public static async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username))
    return user ? new User(user.id, user.username, user.password, JSON.parse(user.favorites || "[]")) : null
  }

  public static async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user ? new User(user.id, user.username, user.password, JSON.parse(user.favorites || "[]")) : null
  }
}
