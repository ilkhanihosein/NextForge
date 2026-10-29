"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button, Field, FormMessage, fieldAria } from "@/components/ui";
import { authClient } from "../auth-client";
import { setPasswordSchema } from "../schemas";
import { NewPasswordFields } from "./new-password-fields";
import { PasswordInput } from "./password-input";

export function ChangePasswordForm() {
  const t = useTranslations("auth");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>();
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const parsed = setPasswordSchema.safeParse(Object.fromEntries(form));
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
    const { error } = await authClient.changePassword({
      currentPassword: String(form.get("current")),
      newPassword: parsed.data.password,
      revokeOtherSessions: true,
    });
    setState(error ? "error" : "done");
    if (!error) formEl.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <FormMessage tone="error">
        {state === "error" ? t("errors.currentPasswordWrong") : undefined}
      </FormMessage>
      <FormMessage tone="success">
        {state === "done" ? t("passwordChanged") : undefined}
      </FormMessage>
      <Field label={t("currentPassword")} htmlFor="current">
        <PasswordInput
          {...fieldAria("current")}
          name="current"
          autoComplete="current-password"
          required
        />
      </Field>
      <NewPasswordFields errors={errors} />
      <Button type="submit" loading={state === "pending"} className="justify-self-start">
        {t("savePassword")}
      </Button>
    </form>
  );
}
