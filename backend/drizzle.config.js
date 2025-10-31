import { defineConfig } from "drizzle-kit";

// Plain JavaScript ESM config. This avoids TypeScript typing problems
// while keeping the same runtime config expected by drizzle-kit.
export default defineConfig({
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  migrationsFolder: "./migrations",
  out: "./drizzle",
});
