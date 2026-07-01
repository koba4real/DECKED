import { integer, pgEnum, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const gameMode = pgEnum("game_mode", ["classic", "no_mercy"]);
export const endCondition = pgEnum("end_condition", ["empty_hand", "mercy_rule"]);

export const gameSession = pgTable("game_session", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  winnerId: integer().notNull().references(() => user.id, { onDelete: "restrict" }),
  mode: gameMode().notNull(),
  endCondition: endCondition().notNull(),
  scoreAwarded: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

// ponytail: minimal pivot (composite PK + cascade only); add per-player score/placement when needed.
export const gameSessionPlayer = pgTable("game_session_player", {
  gameSessionId: integer().notNull().references(() => gameSession.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
}, t => [primaryKey({ columns: [t.gameSessionId, t.userId] })]);

// 1:1 with user, so userId is the PK — no separate id needed.
export const playerProfile = pgTable("player_profile", {
  userId: integer().primaryKey().references(() => user.id, { onDelete: "cascade" }),
  cumulativeScore: integer().notNull().default(0),
  totalWins: integer().notNull().default(0),
  totalLosses: integer().notNull().default(0),
});
