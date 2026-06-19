import db from "../../db.js";
import { eq } from "drizzle-orm";
import { users } from "../../schema.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const [row] = await db.select().from(users).where(eq(users.name, name));
  return row;
}
