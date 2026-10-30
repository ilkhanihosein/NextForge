import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/features/auth/db/schema";

/**
 * Append-only record of security-relevant admin actions. Names are copied in, so the
 * history still reads correctly after a user is deleted.
 */
export const auditLog = pgTable(
  "audit_log",
  {
    id: text().primaryKey(),
    actorId: text().references(() => user.id, { onDelete: "set null" }),
    actorName: text().notNull(),
    action: text().notNull(),
    targetId: text(),
    targetLabel: text(),
    meta: jsonb().$type<Record<string, string>>(),
    ip: text(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (t) => [index().on(t.createdAt)],
);

export type AuditEntry = typeof auditLog.$inferSelect;
