import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./db/index.js",
    "./models/admin.js",
    "./models/productModel.js",
    "./models/giftCardModel.js",
  ],
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
