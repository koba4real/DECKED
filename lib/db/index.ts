import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import env from "../env";
import * as schema from "./Schema";

// Production runs on Neon; local dev talks to a plain Postgres over TCP via
// node-postgres. Same STORAGE_DATABASE_URL var, driver picked by NODE_ENV.
//
// Neon uses the *WebSocket* driver (neon-serverless), NOT neon-http: add-game
// writes run inside db.transaction(), and the HTTP driver rejects that with
// "No transactions support in neon-http driver". The WebSocket driver speaks
// the full session protocol, so transactions work. Node 22+ (our engines floor
// and Vercel's runtime) ships a global WebSocket, so no `ws` package is needed.
//
// ponytail: static-imports both drivers; dynamic-import if edge bundling of pg bites.
// Both branches expose the same Drizzle query API; unify the static type so callers
// (e.g. db.transaction) don't fight the two drivers' divergent union.
const db: NodePgDatabase<typeof schema> = env.NODE_ENV === "production"
  ? drizzleNeon({ connection: env.STORAGE_DATABASE_URL, schema, casing: "snake_case" }) as unknown as NodePgDatabase<typeof schema>
  : drizzlePg({ connection: env.STORAGE_DATABASE_URL, schema, casing: "snake_case" });

export default db;
