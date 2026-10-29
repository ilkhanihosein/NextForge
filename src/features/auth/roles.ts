import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Single source of truth for roles and permissions, shared by server and client.
 * Add a resource to `statement`, then grant actions per role.
 */
export const statement = {
  ...defaultStatements,
  content: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    ...adminAc.statements,
    content: ["read", "create", "update", "delete"],
  }),
  member: ac.newRole({ content: ["read"] }),
};

export type Role = keyof typeof roles;
export const ROLES = Object.keys(roles) as Role[];
export const DEFAULT_ROLE: Role = "member";
export const ADMIN_ROLES: Role[] = ["admin"];

export const isAdminRole = (role: string | null | undefined) =>
  !!role && (ADMIN_ROLES as string[]).includes(role);
