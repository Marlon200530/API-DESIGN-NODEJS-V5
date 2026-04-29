import { describe, expect, it } from "vitest";

process.env.API_PREFIX ??= "/api/v1";
process.env.PORT ??= "3000";
process.env.DATABASE_URL ??= "postgresql://user:password@localhost:5432/test";
process.env.JWT_SECRET ??= "test-secret-with-enough-length";
process.env.JWT_EXPIRES_IN ??= "7d";
process.env.BCRYPT_ROUNDS ??= "10";

describe("jwt utils", () => {
  it("generates and verifies a token payload", async () => {
    const { generateToken, verifyToken } = await import("../../src/utils/jwt.ts");

    const token = await generateToken({
      id: "user-id",
      email: "marlon@example.com",
      username: "marlon",
    });

    const payload = await verifyToken(token);

    expect(payload.id).toBe("user-id");
    expect(payload.email).toBe("marlon@example.com");
    expect(payload.username).toBe("marlon");
  });
});
