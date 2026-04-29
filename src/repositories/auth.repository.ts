import type { NewUser } from "../db/schema.ts";
import { users } from "../db/schema.ts";
import { db } from "../db/connection.ts";
import { eq, or } from "drizzle-orm";


export const createUser = async (newUser: NewUser) => {
  const [createdUser] = await db
    .insert(users)
    .values(newUser)
    .returning();

  return createdUser;
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return user;
};

export const findUserByEmailOrUsername = async (email: string, username: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)));

  return user;
};
