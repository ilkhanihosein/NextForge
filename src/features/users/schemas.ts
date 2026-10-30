import { z } from "zod";
import { ASSIGNABLE_ROLES, emailSchema } from "@/features/auth";
import { routing } from "@/i18n/routing";

export const inviteUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]),
  locale: z.enum(routing.locales),
  /** Only asked for (and checked) when inviting an admin. */
  password: z.string().max(128).optional(),
});

export const userIdSchema = z.object({ userId: z.string().min(1) });

export const setRoleSchema = userIdSchema.extend({
  role: z.enum(ASSIGNABLE_ROLES as [string, ...string[]]),
});

export type UserStatus = "active" | "invited" | "suspended";
