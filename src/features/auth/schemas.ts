import { z } from "zod";

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

export const emailSchema = z.email().trim().toLowerCase().max(254);

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, { error: "passwordTooShort" })
  .max(PASSWORD_MAX, { error: "passwordTooLong" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(PASSWORD_MAX),
});

export const setPasswordSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    error: "passwordMismatch",
  });

export const acceptInviteSchema = setPasswordSchema.and(
  z.object({ token: z.string().min(20) }),
);
