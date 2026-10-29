"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button, Field, FormMessage, Input, fieldAria } from "@/components/ui";
import { localizedPath } from "@/i18n/paths";
import { authClient } from "../auth-client";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "pending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("pending");
    const { error } = await authClient.requestPasswordReset({
      email: String(new FormData(event.currentTarget).get("email")),
      redirectTo: localizedPath("/reset-password", locale),
    });
    // Same message whether or not the account exists: no user enumeration.
    setState(error?.status === 429 ? "error" : "sent");
  }

  if (state === "sent") return <FormMessage tone="success">{t("resetSent")}</FormMessage>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <FormMessage tone="error">
        {state === "error" ? t("errors.tooManyAttempts") : undefined}
      </FormMessage>
      <Field label={t("email")} htmlFor="email">
        <Input
          {...fieldAria("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </Field>
      <Button type="submit" size="lg" loading={state === "pending"} className="w-full">
        {t("sendResetLink")}
      </Button>
    </form>
  );
}
