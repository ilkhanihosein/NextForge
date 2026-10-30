"use client";

import { UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  Field,
  FormMessage,
  Input,
  Select,
  fieldAria,
} from "@/components/ui";
import { ASSIGNABLE_ROLES, DEFAULT_ROLE, isAdminRole } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { inviteUserAction } from "../actions/user-actions";

/** Admins invite members; only an owner can invite an admin, and confirms with a password. */
export function InviteUserDialog({ isOwner }: { isOwner: boolean }) {
  const t = useTranslations("admin.users");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string>(DEFAULT_ROLE);
  const [state, action, pending] = useActionState(
    async (
      prev: Awaited<ReturnType<typeof inviteUserAction>> | null,
      formData: FormData,
    ) => {
      const result = await inviteUserAction(prev, formData);
      if (result.ok) {
        toast.success(t("toast.invited"));
        setOpen(false);
      }
      return result;
    },
    null,
  );

  const fieldError = (name: string) =>
    state && !state.ok && state.fieldErrors?.[name]
      ? t("errors.invalidField")
      : undefined;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus aria-hidden />
        {t("invite")}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("inviteTitle")}
        description={t("inviteDescription")}
        closeLabel={tc("close")}
      >
        <form action={action} className="grid gap-5">
          <FormMessage tone="error">
            {state && !state.ok && !state.fieldErrors
              ? t(`errors.${state.error}` as "errors.generic")
              : undefined}
          </FormMessage>
          <Field
            label={t("fields.name")}
            htmlFor="invite-name"
            error={fieldError("name")}
          >
            <Input
              {...fieldAria("invite-name", fieldError("name"))}
              name="name"
              required
              autoComplete="off"
            />
          </Field>
          <Field
            label={t("fields.email")}
            htmlFor="invite-email"
            error={fieldError("email")}
          >
            <Input
              {...fieldAria("invite-email", fieldError("email"))}
              name="email"
              type="email"
              required
              autoComplete="off"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            {isOwner ? (
              <Field label={t("fields.role")} htmlFor="invite-role">
                <Select
                  id="invite-role"
                  name="role"
                  value={role}
                  onValueChange={setRole}
                  options={ASSIGNABLE_ROLES.map((r) => ({
                    value: r,
                    label: t(`roles.${r}` as "roles.admin"),
                  }))}
                />
              </Field>
            ) : (
              <input type="hidden" name="role" value={DEFAULT_ROLE} />
            )}
            <Field label={t("fields.emailLanguage")} htmlFor="invite-locale">
              <Select
                id="invite-locale"
                name="locale"
                defaultValue={locale}
                options={routing.locales.map((l) => ({
                  value: l,
                  label: siteConfig.localeNames[l],
                }))}
              />
            </Field>
          </div>
          {isOwner && isAdminRole(role) ? (
            <Field
              label={t("confirm.passwordLabel")}
              htmlFor="invite-password"
              hint={t("confirm.passwordHint")}
            >
              <Input
                id="invite-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
          ) : null}
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" loading={pending}>
              {t("sendInvite")}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
