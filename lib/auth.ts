import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "./db/index"; // your drizzle instance
import env from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  user: {
    additionalFields: {
      cumulativeScore: { type: "number", input: false },
      totalWins: { type: "number", input: false },
      totalLosses: { type: "number", input: false },
    },
  },
  session: {
    // Serve the session from a signed cookie for a short window so protected
    // routes don't hit the DB on every request. Falls back to a DB read on miss.
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
});

export type UserWithId = Omit<typeof auth.$Infer.Session.user, "id"> & {
  id: number;
};
