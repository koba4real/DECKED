import db from "~~/lib/db";
import { user } from "~~/lib/db/Schema/auth";
import { desc, sql } from "drizzle-orm";

export default defineAuthenticatedEventHandler(async () => {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      gamesPlayed: sql<number>`${user.totalWins} + ${user.totalLosses}`.mapWith(Number),
      wins: user.totalWins,
      totalScore: user.cumulativeScore,
    })
    .from(user)
    .orderBy(desc(user.cumulativeScore));

  return rankPlayers(rows);
});
