import type { JwtPayload } from "../src/utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
