import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.ts";
import { verifyToken } from "../utils/jwt.ts";

export const auth = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "Token not provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError(401, "Token not provided");
  }

  const payload = await verifyToken(token);

  req.user = payload;

  next();
};
