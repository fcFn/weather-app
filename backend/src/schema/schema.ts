import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username'),
  password: varchar('password', { length: 256 }).notNull(),
  favorites: varchar('favorites')
});
