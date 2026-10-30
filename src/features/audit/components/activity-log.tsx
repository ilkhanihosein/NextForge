import {
  Ban,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserPlus,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AuditAction } from "../actions";
import type { AuditEntry } from "../db/schema";

const icons: Record<AuditAction, LucideIcon> = {
  userInvite: UserPlus,
  userRole: ShieldCheck,
  userSuspend: Ban,
  userReactivate: RotateCcw,
  userDelete: Trash2,
  passwordCheckFailed: KeyRound,
};

const warning: AuditAction[] = ["passwordCheckFailed", "userDelete", "userSuspend"];

export async function ActivityLog({ entries }: { entries: AuditEntry[] }) {
  const t = await getTranslations("admin.activity");
  const tr = await getTranslations("admin.users.roles");
  const format = await getFormatter();

  if (!entries.length)
    return (
      <EmptyState
        icon={ShieldAlert}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );

  const role = (value?: string) => (value ? tr(value as "admin") : "");

  return (
    <ol className="overflow-hidden rounded-xl glass">
      {entries.map((entry) => {
        const action = entry.action as AuditAction;
        const Icon = icons[action] ?? ShieldAlert;
        const meta = entry.meta ?? {};
        return (
          <li key={entry.id} className="flex gap-4 border-b p-4 last:border-0 sm:p-5">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full",
                warning.includes(action)
                  ? "bg-danger/12 text-danger"
                  : "bg-brand/10 text-brand",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">
                  {entry.actorId === null && entry.actorName === "Command line"
                    ? t("commandLine")
                    : entry.actorName}
                </span>{" "}
                <span className="text-muted-foreground">{t(`actions.${action}`)}</span>
                {entry.targetLabel ? (
                  <>
                    {" "}
                    <span className="font-medium">{entry.targetLabel}</span>
                  </>
                ) : null}
              </p>
              {meta.from || meta.to ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("roleChange", { from: role(meta.from), to: role(meta.to) })}
                </p>
              ) : meta.role ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("asRole", { role: role(meta.role) })}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-end text-xs text-muted-foreground">
              <time dateTime={entry.createdAt.toISOString()}>
                {format.dateTime(entry.createdAt, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
              {entry.ip ? (
                <p className="mt-1 tabular-nums" dir="ltr">
                  {entry.ip}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
