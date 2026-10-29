"use client";

import { Ban, MailPlus, RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, Select } from "@/components/ui";
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
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<ActionResult>) =>
    startTransition(async () => {
      const result = await fn();
      if (result.ok) toast.success(t(`toast.${result.message}` as "toast.invited"));
      else toast.error(t(`errors.${result.error}` as "errors.generic"));
    });

  if (isSelf) return <span className="text-xs text-muted-foreground">{t("you")}</span>;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Select
        aria-label={t("fields.role")}
        defaultValue={user.role}
        disabled={pending}
        onValueChange={(role) => run(() => setRoleAction(user.id, role))}
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
        onClick={() =>
          run(() => setSuspendedAction(user.id, user.status !== "suspended"))
        }
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
        onClick={() => {
          if (window.confirm(t("confirmDelete", { name: user.name })))
            run(() => deleteUserAction(user.id));
        }}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
