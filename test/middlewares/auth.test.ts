import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

process.env.API_PREFIX ??= "/api/v1";
process.env.PORT ??= "3000";
process.env.DATABASE_URL ??= "postgresql://user:password@localhost:5432/test";
process.env.JWT_SECRET ??= "test-secret-with-enough-length";
process.env.JWT_EXPIRES_IN ??= "7d";
process.env.BCRYPT_ROUNDS ??= "10";

describe("auth middleware", () => {
  it("adds the verified payload to req.user", async () => {
    const { auth } = await import("../../src/middlewares/auth.ts");
    const { generateToken } = await import("../../src/utils/jwt.ts");

    const token = await generateToken({
      id: "user-id",
      email: "marlon@example.com",
      username: "marlon",
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    const next = vi.fn() as NextFunction;

    await auth(req, {} as Response, next);

    expect(req.user).toMatchObject({
      id: "user-id",
      email: "marlon@example.com",
      username: "marlon",
    });
    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects requests without a bearer token", async () => {
    const { auth } = await import("../../src/middlewares/auth.ts");

    await expect(
      auth({ headers: {} } as Request, {} as Response, vi.fn() as NextFunction),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Token not provided",
    });
  });
});
