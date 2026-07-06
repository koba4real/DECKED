import db from "~~/lib/db";
import { gameSession, gameSessionPlayer, gameSessionSchema } from "~~/lib/db/Schema/game";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, gameSessionSchema.safeParse);
  if (!result.success)
    sendZodError(result.error);

  const { playerIds, winnerId, mode, endCondition, scoreAwarded } = result.data;

  // One transaction: the session and every player row commit or roll back together.
  await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(gameSession)
      .values({ winnerId, mode, endCondition, scoreAwarded })
      .returning({ id: gameSession.id });

    if (!session)
      throw new Error("Insert returned no game session");

    await tx.insert(gameSessionPlayer).values(
      playerIds.map(userId => ({ gameSessionId: session.id, userId })),
    );
  });

  return { ok: true };
});
