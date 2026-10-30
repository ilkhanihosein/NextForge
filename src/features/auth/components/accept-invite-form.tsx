"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button, FormMessage } from "@/components/ui";
import { acceptInviteAction } from "../actions/accept-invite";
import { NewPasswordFields } from "./new-password-fields";

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(acceptInviteAction, null);

  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="token" value={token} />
      <input
        type="hidden"
        name="username"
        autoComplete="username"
        value={email}
        readOnly
      />
      <FormMessage tone="error">
        {state && !state.ok && !state.fieldErrors
          ? t(`errors.${state.error}` as "errors.inviteInvalid")
          : undefined}
      </FormMessage>
      <NewPasswordFields errors={state && !state.ok ? state.fieldErrors : undefined} />
      <Button type="submit" size="lg" loading={pending} className="w-full">
        {t("activateAccount")}
      </Button>
    </form>
  );
}
