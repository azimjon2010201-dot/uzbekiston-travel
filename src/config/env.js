import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL noto'g'ri formatda"),
  PORT: z.coerce.number().int().positive().default(8000),
  JWT_SECRET: z.string().min(32, "JWT_SECRET kamida 32 ta belgidan iborat bo'lishi kerak"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:8000"),
  API_BASE_URL: z.string().url().default("http://localhost:8000")
});

export const env = envSchema.parse(process.env);
