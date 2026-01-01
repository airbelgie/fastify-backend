import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  firstName: varchar("first_name").notNull(),
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    cache: 1,
    increment: 1,
    maxValue: 2147483647,
    minValue: 1,
    startWith: 1000,
  }),
  lastName: varchar("last_name").notNull(),
  password: text("password").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  username: varchar("username").notNull(),
});
