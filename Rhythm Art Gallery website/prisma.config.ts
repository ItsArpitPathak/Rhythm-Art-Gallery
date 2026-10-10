import { defineConfig } from "prisma/config";

// The Prisma CLI does not read .env by itself. Node does (no extra dependency).
try {
  process.loadEnvFile();
} catch {
  /* no .env: DATABASE_URL must come from the environment */
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Empty fallback lets `prisma generate` run (postinstall, CI) without a database.
  // Commands that connect (migrate, seed) fail with a clear error until DATABASE_URL is set.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
