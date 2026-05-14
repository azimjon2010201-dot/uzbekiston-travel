import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(32)
    .regex(/^\+?[0-9\s()-]+$/, "Telefon raqam noto'g'ri formatda"),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128)
});

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2).max(80).optional(),
  lastName: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()).optional(),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(32)
    .regex(/^\+?[0-9\s()-]+$/, "Telefon raqam noto'g'ri formatda")
    .optional()
});
