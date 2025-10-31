import { pgTable, serial, text, varchar, integer, boolean, real, varcharArray } from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull().unique(),
  
});
