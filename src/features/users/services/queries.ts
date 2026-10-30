import "server-only";
import { and, count, desc, eq, exists, ilike, or } from "drizzle-orm";
import { account, user } from "@/features/auth/server";
import { db } from "@/lib/db";
import type { UserStatus } from "../schemas";

const PAGE_SIZE = 20;

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  createdAt: Date;
};

export async function listUsers({
  query,
  page = 1,
  role,
}: {
  query?: string;
  page?: number;
  role?: string;
}) {
  const search = query?.trim();
  const where = and(
    search
      ? or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
      : undefined,
    role ? eq(user.role, role) : undefined,
  );

  // A user is "active" once a credential password exists (set via their invite link).
  const hasPassword = exists(
    db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, user.id), eq(account.providerId, "credential"))),
  ).mapWith(Boolean);

  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
        hasPassword,
      })
      .from(user)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(user).where(where),
  ]);

  const items: UserListItem[] = rows.map(({ banned, hasPassword, ...r }) => ({
    ...r,
    status: banned ? "suspended" : hasPassword ? "active" : "invited",
  }));

  return { items, total: total?.value ?? 0, page, pageSize: PAGE_SIZE };
}

export async function countUsersByRole() {
  const rows = await db
    .select({ role: user.role, value: count() })
    .from(user)
    .groupBy(user.role);
  return Object.fromEntries(rows.map((r) => [r.role, r.value])) as Record<string, number>;
}

export async function getUserById(id: string) {
  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return row ?? null;
}
