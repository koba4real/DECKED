import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import env from "../env";
import * as schema from "./Schema";

// Production runs on Neon (HTTP driver, works on Vercel serverless); local dev
// talks to a plain Postgres over TCP via node-postgres. Same STORAGE_DATABASE_URL var,
// driver picked by NODE_ENV.
// ponytail: static-imports both drivers; dynamic-import if edge bundling of pg bites.
const db = env.NODE_ENV === "production"
  ? drizzleNeon({ client: neon(env.STORAGE_DATABASE_URL), schema, casing: "snake_case" })
  : drizzlePg({ connection: env.STORAGE_DATABASE_URL, schema, casing: "snake_case" });

export default db;
