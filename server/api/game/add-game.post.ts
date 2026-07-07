import db from "~~/lib/db";
import { user } from "~~/lib/db/Schema/auth";
import { gameSession, gameSessionSchema } from "~~/lib/db/Schema/game";
import { eq, inArray, sql } from "drizzle-orm";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, gameSessionSchema.safeParse);
  if (!result.success)
    sendZodError(result.error);

  const { playerIds, winnerId, mode, endCondition, scoreAwarded } = result.data;
  const loserIds = playerIds.filter(id => id !== winnerId);

  // One transaction: the session and every player's stats commit or roll back together.
  await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(gameSession)
      .values({ winnerId, mode, endCondition, scoreAwarded })
      .returning({ id: gameSession.id });

    if (!session)
      throw new Error("Insert returned no game session");

    await tx.update(user)
      .set({
        cumulativeScore: sql`${user.cumulativeScore} + ${scoreAwarded}`,
        totalWins: sql`${user.totalWins} + 1`,
      })
      .where(eq(user.id, winnerId));

    if (loserIds.length > 0) {
      await tx.update(user)
        .set({ totalLosses: sql`${user.totalLosses} + 1` })
        .where(inArray(user.id, loserIds));
    }
  });
  leaderboardSubject.notify();
});
