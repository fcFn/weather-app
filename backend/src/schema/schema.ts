import { index, pgTable, serial, text, varchar } from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: varchar("password", { length: 256 }).notNull(),
    favorites: varchar("favorites").default("[]").notNull(),
  },
  table => ({
    usernameIdx: index("username").on(table.username),
  }),
)
