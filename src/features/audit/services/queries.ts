import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLog } from "../db/schema";

export async function listAudit(limit = 100) {
  return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
}
