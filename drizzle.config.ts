import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import env from "./lib/env";

export default defineConfig({
  out: "./lib/db/migrations",
  schema: "./lib/db/Schema/index.ts",
  casing: "snake_case",
  dialect: "postgresql",
  dbCredentials: {
    url: env.STORAGE_DATABASE_URL,
  },
});
