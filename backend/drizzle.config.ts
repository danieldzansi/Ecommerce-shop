import { defineConfig } from "drizzle-kit";

// The drizzle-kit types can be strict depending on the installed version.
// Use a lightweight `any` cast for the driver/dbCredentials to avoid
// TypeScript complaints in this repo while keeping the runtime shape.
export default defineConfig({
  driver: ("pg" as any),
  dbCredentials: ({ connectionString: process.env.DATABASE_URL } as any),
  migrationsFolder: "./migrations",
  out: "./drizzle",
} as any);
