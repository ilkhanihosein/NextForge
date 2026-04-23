"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useAppContext } from "@/context/app-context";
import { ApiError } from "@/lib/api/errors";

type LoginFormProps = {
  locale: string;
  redirectTo?: string;
};

export function LoginForm({ locale, redirectTo }: LoginFormProps) {
  const { dictionary } = useAppContext();
  const a = dictionary.auth;
  const router = useRouter();
  const { isAuthenticated, isSessionPending } = useAuth();
  const login = useLogin({ locale, redirectTo });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && !isSessionPending) {
      router.push(redirectTo ?? `/${locale}/profile`);
    }
  }, [isAuthenticated, isSessionPending, locale, redirectTo, router]);

  const message =
    login.error instanceof ApiError
      ? login.error.message
      : login.error instanceof Error
        ? login.error.message
        : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-panel p-6 shadow-soft">
      <h1 className="text-xl font-bold tracking-tight text-foreground">{a.loginTitle}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{a.loginSubtitle}</p>
      <p className="mt-3 rounded-lg border border-dashed border-border/80 bg-muted/20 p-3 text-xs text-muted-foreground">
        {a.demoHint}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate({ email: email.trim(), password });
        }}
      >
        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {a.emailLabel}
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-brand/30 transition focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="auth-password"
            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {a.passwordLabel}
          </label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-brand/30 transition focus:ring-2"
          />
        </div>

        {message ? (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {login.isPending ? a.submittingLabel : a.submitLabel}
        </button>
      </form>
    </div>
  );
}
