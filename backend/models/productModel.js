import { pgTable, serial, text, varchar, integer, boolean, real, varcharArray } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  image: varcharArray("image").notNull(), 
  category: varchar("category", { length: 255 }).notNull(),
  subCategory: varchar("subCategory", { length: 255 }).notNull(),
  sizes: varcharArray("sizes").notNull(),
  bestseller: boolean("bestseller").default(false),
  date: integer("date").notNull(),
});
