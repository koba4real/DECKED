import { integer, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import * as z from "zod";

import { user } from "./auth";

export const gameMode = pgEnum("game_mode", ["classic", "no_mercy"]);
export const endCondition = pgEnum("end_condition", ["empty_hand", "mercy_rule"]);

function toLabel(value: string) {
  return value
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const gameModeOptions = gameMode.enumValues.map(value => ({ label: toLabel(value), value }));
export const endConditionOptions = endCondition.enumValues.map(value => ({ label: toLabel(value), value }));

export const gameSession = pgTable("game_session", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  winnerId: integer().notNull().references(() => user.id, { onDelete: "restrict" }),
  mode: gameMode().notNull(),
  endCondition: endCondition().notNull(),
  scoreAwarded: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const gameSessionSchema = z.object({
  playerIds: z.array(z.number()).min(2, "Select at least 2 players").max(10, "Select at most 10 players"),
  winnerId: z.number({ error: "Select a winner" }).min(1, "Select a winner"),
  mode: z.enum(gameMode.enumValues, { error: "Select a game mode" }),
  endCondition: z.enum(endCondition.enumValues, { error: "Select an end condition" }),
  scoreAwarded: z.number({ error: "Enter a score" }).min(0, { error: "Score can't be negative" }).max(5000, { error: "Score can't exceed 5000" }),
})
  .refine(data => data.playerIds.includes(data.winnerId), {
    message: "Winner must be one of the selected players",
    path: ["winnerId"],
  })
  .refine(data => new Set(data.playerIds).size === data.playerIds.length, {
    message: "The same player can't be added twice",
    path: ["playerIds"],
  })
  .refine(data => data.endCondition !== "mercy_rule" || data.mode === "no_mercy", {
    message: "Mercy rule only applies to No Mercy mode",
    path: ["endCondition"],
  });

export type insertGameSession = z.output<typeof gameSessionSchema>;
