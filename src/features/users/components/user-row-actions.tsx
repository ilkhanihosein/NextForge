"use client";

import { Ban, MailPlus, RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Select,
  useConfirm,
  useConfirmWithPassword,
} from "@/components/ui";
import { ASSIGNABLE_ROLES, isAdminRole, isOwnerRole } from "@/features/auth";
import type { ActionResult } from "@/lib/action";
import {
  deleteUserAction,
  resendInviteAction,
  setRoleAction,
  setSuspendedAction,
} from "../actions/user-actions";
import type { UserListItem } from "../services/queries";

/**
 * Shows only what the signed-in admin may do to this user; the server actions enforce
 * the same rules. Owners can't be touched here, and only an owner acts on admins.
 */
export function UserRowActions({
  user,
  isSelf,
  actorIsOwner,
}: {
  user: UserListItem;
  isSelf: boolean;
  actorIsOwner: boolean;
}) {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const confirm = useConfirm();
  const confirmWithPassword = useConfirmWithPassword();
  const [pending, startTransition] = useTransition();
  // Controlled, so a cancelled confirmation leaves the old role showing.
  const [role, setRole] = useState(user.role);
  const name = user.name;
  const roleLabel = t(`roles.${user.role}` as "roles.admin");

  const run = (fn: () => Promise<ActionResult>, onError?: () => void) =>
    startTransition(async () => {
      const result = await fn();
      if (result.ok) toast.success(t(`toast.${result.message}` as "toast.invited"));
      else {
        onError?.();
        toast.error(t(`errors.${result.error}` as "errors.generic"));
      }
    });

  const passwordPrompt = {
    passwordLabel: t("confirm.passwordLabel"),
    passwordHint: t("confirm.passwordHint"),
  };

  const changeRole = async (next: string) => {
    let password: string | undefined;
    if (next === "admin") {
      const typed = await confirmWithPassword({
        title: t("confirm.makeAdmin.title", { name }),
        description: t("confirm.makeAdmin.body"),
        confirmLabel: t("confirm.makeAdmin.action"),
        ...passwordPrompt,
      });
      if (typed === null) return;
      password = typed;
    } else {
      const ok = await confirm({
        title: t("confirm.removeAdmin.title", { name }),
        description: t("confirm.removeAdmin.body"),
        confirmLabel: t("confirm.removeAdmin.action"),
        tone: "default",
      });
      if (!ok) return;
    }
    const previous = role;
    setRole(next);
    run(
      () => setRoleAction(user.id, next, password),
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
    const options = {
      title: t("confirm.delete.title", { name }),
      description: t("confirm.delete.body"),
      confirmLabel: t("confirm.delete.action"),
    };
    // Removing an admin needs the owner's password; a member just a confirmation.
    if (isAdminRole(user.role)) {
      const password = await confirmWithPassword({ ...options, ...passwordPrompt });
      if (password !== null) run(() => deleteUserAction(user.id, password));
    } else if (await confirm(options)) {
      run(() => deleteUserAction(user.id));
    }
  };

  if (isSelf) return <span className="text-xs text-muted-foreground">{t("you")}</span>;
  // Owners are managed from the command line only; admins by owners only.
  if (isOwnerRole(user.role) || (isAdminRole(user.role) && !actorIsOwner))
    return (
      <div className="flex justify-end">
        <Badge tone={isOwnerRole(user.role) ? "brand" : "secondary"}>{roleLabel}</Badge>
      </div>
    );

  return (
    <div className="flex items-center justify-end gap-1.5">
      {actorIsOwner ? (
        <Select
          aria-label={t("fields.role")}
          value={role}
          disabled={pending}
          onValueChange={changeRole}
          size="sm"
          className="w-32"
          options={ASSIGNABLE_ROLES.map((r) => ({
            value: r,
            label: t(`roles.${r}` as "roles.admin"),
          }))}
        />
      ) : (
        <Badge tone="secondary">{roleLabel}</Badge>
      )}
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
