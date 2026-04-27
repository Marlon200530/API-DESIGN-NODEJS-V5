import { env as loadEnv } from "custom-env";
import { z } from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || "dev";


// Steps do it
// 1 - carregar as variaveis do ambiente
// 2 - escrever o schema da validação das variaveis do ambiente
// 3 - fazer o parse e o tratamento de erros da validação do zod
// 4 - caso não hajam erros, é só exportar as variaveis do ambiente




const _isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

if (isDevelopment) {
  loadEnv();
} else if (isTesting) {
  loadEnv("test");
}

const envSchema = z.object({
  APP_STAGE: z.enum(["dev", "test", "production"]).default("dev"),
  API_PREFIX: z.string().refine(
    (val) => val.startsWith('/api/v') || val.startsWith('api/v'),
    { message: 'Invalid string: must start with "/api/v"' }
  ),
  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  JWT_SECRET: z.string().min(12, "Must be 32 chars long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;

/*
    type Env  = {
        APP_STAGE: string,
        PORT: number,
        DATABASE_URL: string,
        JWT_SECRET: string,
        JWT_EXPIRES_IN: string,
        BCRYPT_ROUNDS: number

    }

*/

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log("Invalid env var");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));

    process.exit(1);
  }
}

export const isProd = () => env.APP_STAGE === 'production';
export const isDev = () => env.APP_STAGE === 'dev';
export const isTest = () => env.APP_STAGE === 'test';

export {env}




import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
};
