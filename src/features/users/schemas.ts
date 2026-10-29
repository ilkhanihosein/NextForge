import { z } from "zod";
import { emailSchema, ROLES } from "@/features/auth";
import { routing } from "@/i18n/routing";

export const inviteUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  role: z.enum(ROLES as [string, ...string[]]),
  locale: z.enum(routing.locales),
});

export const userIdSchema = z.object({ userId: z.string().min(1) });

export const setRoleSchema = userIdSchema.extend({
  role: z.enum(ROLES as [string, ...string[]]),
});

export type UserStatus = "active" | "invited" | "suspended";
