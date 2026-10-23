import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address.")
    .trim()
    .toLowerCase()
    .max(160),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(200, "Password is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;
