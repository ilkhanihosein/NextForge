import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Single source of truth for roles and permissions, shared by server and client.
 * Add a resource to `statement`, then grant actions per role.
 *
 * Nobody gets impersonation, setting someone else's password or email, or raw user
 * updates: those turn one stolen admin session into a takeover of every account.
 * Who may act on whom (an admin never on an owner or another admin) is enforced in the
 * users feature's server actions, which are the only way in (see the auth route).
 */
export const statement = {
  ...defaultStatements,
  content: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

const content = ["read", "create", "update", "delete"] as const;

export const roles = {
  /** The site's owner(s): the only role that can grant, change or remove admin rights. */
  owner: ac.newRole({
    user: ["create", "list", "get", "set-role", "ban", "delete"],
    session: ["list", "revoke"],
    content: [...content],
  }),
  /** Day-to-day staff: members and content, never other admins or owners. */
  admin: ac.newRole({
    user: ["create", "list", "get", "ban", "delete"],
    session: ["list", "revoke"],
    content: [...content],
  }),
  member: ac.newRole({ content: ["read"] }),
};

export type Role = keyof typeof roles;
export const ROLES = Object.keys(roles) as Role[];
/** Roles that can be given from the admin panel; ownership is granted from the CLI only. */
export const ASSIGNABLE_ROLES: Role[] = ["admin", "member"];
export const DEFAULT_ROLE: Role = "member";
export const ADMIN_ROLES: Role[] = ["owner", "admin"];

export const isAdminRole = (role: string | null | undefined) =>
  !!role && (ADMIN_ROLES as string[]).includes(role);

export const isOwnerRole = (role: string | null | undefined) => role === "owner";
