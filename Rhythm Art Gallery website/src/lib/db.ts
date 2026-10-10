import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// One client per server process (avoids exhausting connections during Next.js hot reload).
const globalForDb = globalThis as unknown as { db?: PrismaClient };

export function makeClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForDb.db ?? makeClient();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
