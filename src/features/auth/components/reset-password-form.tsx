"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button, FormMessage } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { authClient } from "../auth-client";
import { setPasswordSchema } from "../schemas";
import { NewPasswordFields } from "./new-password-fields";

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>();
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = setPasswordSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((i) => [i.path.join("."), [i.message]]),
        ),
      );
      return;
    }
    setErrors(undefined);
    setState("pending");
    const { error } = await authClient.resetPassword({
      newPassword: parsed.data.password,
      token,
    });
    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return (
      <div className="grid gap-5">
        <FormMessage tone="success">{t("resetDone")}</FormMessage>
        <Link href="/login" className="text-center text-sm text-brand hover:underline">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <FormMessage tone="error">
        {state === "error" ? t("errors.resetInvalid") : undefined}
      </FormMessage>
      <NewPasswordFields errors={errors} />
      <Button type="submit" size="lg" loading={state === "pending"} className="w-full">
        {t("savePassword")}
      </Button>
    </form>
  );
}
