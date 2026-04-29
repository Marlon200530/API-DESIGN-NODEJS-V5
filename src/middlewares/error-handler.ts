import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error.ts";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
};
