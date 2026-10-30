"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button, Field, FormMessage, Input, fieldAria } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { localizedPath } from "@/i18n/paths";
import { authClient } from "../auth-client";
import { AFTER_LOGIN_PATH } from "../config";
import { PasswordInput } from "./password-input";

/** Only same-site relative paths are honoured, so `?next=` can't become an open redirect. */
function safeNext(next: string | undefined, fallback: string) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : fallback;
}

export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(undefined);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setPending(false);
      setError(
        error.status === 429
          ? t("errors.tooManyAttempts")
          : error.code === "BANNED_USER"
            ? t("errors.banned")
            : t("errors.invalidCredentials"),
      );
      return;
    }
    // Full navigation: `next` already carries its locale prefix, and every server
    // component should render with the fresh session.
    window.location.assign(safeNext(next, localizedPath(AFTER_LOGIN_PATH, locale)));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <FormMessage tone="error">{error}</FormMessage>
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
      <Field
        label={
          <span className="flex w-full items-center justify-between">
            {t("password")}
            <Link
              href="/forgot-password"
              className="text-xs font-normal text-brand hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </span>
        }
        htmlFor="password"
      >
        <PasswordInput
          {...fieldAria("password")}
          name="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
        {t("signIn")}
      </Button>
    </form>
  );
}
