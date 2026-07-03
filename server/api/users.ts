import db from "~~/lib/db";
import { user } from "~~/lib/db/Schema/auth";
import { asc } from "drizzle-orm";

export default defineAuthenticatedEventHandler(async () => {
  const users = await db.select({ id: user.id, name: user.name }).from(user).orderBy(asc(user.name));
  return users;
});
