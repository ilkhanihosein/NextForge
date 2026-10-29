"use client";

import { Ban, MailPlus, RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, Select, useConfirm } from "@/components/ui";
import { ROLES } from "@/features/auth";
import type { ActionResult } from "@/lib/action";
import {
  deleteUserAction,
  resendInviteAction,
  setRoleAction,
  setSuspendedAction,
} from "../actions/user-actions";
import type { UserListItem } from "../services/queries";

export function UserRowActions({
  user,
  isSelf,
}: {
  user: UserListItem;
  isSelf: boolean;
}) {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();
  // Controlled, so a cancelled confirmation leaves the old role showing.
  const [role, setRole] = useState(user.role);
  const name = user.name;

  const run = (fn: () => Promise<ActionResult>, onError?: () => void) =>
    startTransition(async () => {
      const result = await fn();
      if (result.ok) toast.success(t(`toast.${result.message}` as "toast.invited"));
      else {
        onError?.();
        toast.error(t(`errors.${result.error}` as "errors.generic"));
      }
    });

  const changeRole = async (next: string) => {
    const key = next === "admin" ? "makeAdmin" : "removeAdmin";
    const ok = await confirm({
      title: t(`confirm.${key}.title`, { name }),
      description: t(`confirm.${key}.body`),
      confirmLabel: t(`confirm.${key}.action`),
      tone: next === "admin" ? "danger" : "default",
    });
    if (!ok) return;
    const previous = role;
    setRole(next);
    run(
      () => setRoleAction(user.id, next),
      () => setRole(previous),
    );
  };

  const toggleSuspended = async () => {
    const key = user.status === "suspended" ? "reactivate" : "suspend";
    const ok = await confirm({
      title: t(`confirm.${key}.title`, { name }),
      description: t(`confirm.${key}.body`),
      confirmLabel: t(`confirm.${key}.action`),
      tone: key === "suspend" ? "danger" : "default",
    });
    if (ok) run(() => setSuspendedAction(user.id, key === "suspend"));
  };

  const remove = async () => {
    const ok = await confirm({
      title: t("confirm.delete.title", { name }),
      description: t("confirm.delete.body"),
      confirmLabel: t("confirm.delete.action"),
    });
    if (ok) run(() => deleteUserAction(user.id));
  };

  if (isSelf) return <span className="text-xs text-muted-foreground">{t("you")}</span>;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Select
        aria-label={t("fields.role")}
        value={role}
        disabled={pending}
        onValueChange={changeRole}
        size="sm"
        className="w-32"
        options={ROLES.map((role) => ({
          value: role,
          label: t(`roles.${role}` as "roles.admin"),
        }))}
      />
      {user.status === "invited" ? (
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={pending}
          title={t("resendInvite")}
          aria-label={t("resendInvite")}
          onClick={() => run(() => resendInviteAction(user.id, locale))}
        >
          <MailPlus />
        </Button>
      ) : null}
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={pending}
        title={user.status === "suspended" ? t("reactivate") : t("suspend")}
        aria-label={user.status === "suspended" ? t("reactivate") : t("suspend")}
        onClick={toggleSuspended}
      >
        {user.status === "suspended" ? <RotateCcw /> : <Ban />}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        disabled={pending}
        title={t("delete")}
        aria-label={t("delete")}
        className="text-danger"
        onClick={remove}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
