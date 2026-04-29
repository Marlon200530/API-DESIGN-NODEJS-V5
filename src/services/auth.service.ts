import type { NewUser } from "../db/schema.ts";
import { createUser, findUserByEmail, findUserByEmailOrUsername } from "../repositories/auth.repository.ts";
import { AppError } from "../utils/app-error.ts";
import { generateToken } from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";

export type LoginUser = Pick<NewUser, "email" | "password">;

export const createUserService = async (user: NewUser) => {
  const existingUser = await findUserByEmailOrUsername(user.email, user.username);

  if (existingUser) {
    throw new AppError(409, "User already exists");
  }

  const hashedPassword = await hashPassword(user.password);
  const createdUser = await createUser({
    ...user,
    password: hashedPassword,
  });

  const token = await generateToken({
    id: createdUser.id,
    email: createdUser.email,
    username: createdUser.username,
  });

  return {
    user: createdUser,
    token,
  };
};

export const loginUserService = async ({ email, password }: LoginUser) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(401, "Invalid credentials");
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid credentials");
  }

  const token = await generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return {
    user,
    token,
  };
};
