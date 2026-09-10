import { pgTable, uuid, text, varchar, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm"; 

export const products = pgTable("products", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  compareAtPrice: real("compareAtPrice"),
  onSale: boolean("onSale").default(false),
  image: jsonb("image").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  subCategory: varchar("subCategory", { length: 255 }).notNull(),
  sizes: jsonb("sizes").notNull(),
  variants: jsonb("variants").default([]),
  bestseller: boolean("bestseller").default(false),
});
