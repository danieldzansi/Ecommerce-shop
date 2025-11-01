import { pgTable, serial, text, varchar, real, boolean, jsonb, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  image: jsonb("image").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  subCategory: varchar("subCategory", { length: 255 }).notNull(),
  sizes: jsonb("sizes").notNull(),      
  bestseller: boolean("bestseller").default(false),
 
});
