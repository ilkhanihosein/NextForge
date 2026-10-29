"use client";

import { useTranslations } from "next-intl";
import { Field, fieldAria } from "@/components/ui";
import { PASSWORD_MIN } from "../schemas";
import { PasswordInput } from "./password-input";

export function NewPasswordFields({
  errors,
}: {
  errors?: Record<string, string[] | undefined>;
}) {
  const t = useTranslations("auth");
  const message = (key?: string) =>
    key
      ? t(`errors.${key}` as "errors.passwordTooShort", { min: PASSWORD_MIN })
      : undefined;
  const passwordError = message(errors?.password?.[0]);
  const confirmError = message(errors?.confirm?.[0]);
  return (
    <>
      <Field
        label={t("newPassword")}
        htmlFor="password"
        error={passwordError}
        hint={t("passwordHint", { min: PASSWORD_MIN })}
      >
        <PasswordInput
          {...fieldAria("password", passwordError)}
          name="password"
          autoComplete="new-password"
          minLength={PASSWORD_MIN}
          required
          autoFocus
        />
      </Field>
      <Field label={t("confirmPassword")} htmlFor="confirm" error={confirmError}>
        <PasswordInput
          {...fieldAria("confirm", confirmError)}
          name="confirm"
          autoComplete="new-password"
          required
        />
      </Field>
    </>
  );
}
