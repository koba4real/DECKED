/* eslint-disable no-console, node/no-process-env */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import process from "node:process";

// Applies pending drizzle migrations over HTTPS (port 443) via the Neon driver.
// Use this instead of `drizzle-kit migrate` whenever outbound TCP 5432 is blocked.
// Pass the target DB inline, e.g.  STORAGE_DATABASE_URL="postgres://..." pnpm db:migrate:http
const url = process.env.STORAGE_DATABASE_URL;
if (!url)
  throw new Error("STORAGE_DATABASE_URL is required");

await migrate(drizzle(neon(url)), { migrationsFolder: "./lib/db/migrations" });
console.log(`✅ Migrations applied to ${new URL(url).host}`);
