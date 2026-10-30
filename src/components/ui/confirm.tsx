"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  use,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { Field } from "./field";
import { Input } from "./input";

type ConfirmOptions = {
  title: ReactNode;
  description?: ReactNode;
  /** The verb on the button: "Delete", "Suspend"… never just "OK". */
  confirmLabel: string;
  /** "danger" for anything destructive or hard to undo. */
  tone?: "danger" | "default";
};

type PasswordOptions = ConfirmOptions & { passwordLabel: string; passwordHint?: string };

type Request =
  | { kind: "confirm"; options: ConfirmOptions; resolve: (value: boolean) => void }
  | {
      kind: "password";
      options: PasswordOptions;
      resolve: (value: string | null) => void;
    };

type Confirm = (options: ConfirmOptions) => Promise<boolean>;
type ConfirmWithPassword = (options: PasswordOptions) => Promise<string | null>;

const ConfirmContext = createContext<{
  confirm: Confirm;
  confirmWithPassword: ConfirmWithPassword;
} | null>(null);

/**
 * `const confirm = useConfirm(); if (await confirm({...})) doIt();`
 * One dialog for the whole app, styled like the rest of it (unlike window.confirm),
 * translated, keyboard friendly, and Esc / backdrop / Cancel all mean "no".
 */
export function useConfirm() {
  const context = use(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return context.confirm;
}

/**
 * Same dialog plus a password field, for changes a stolen session alone mustn't be able
 * to make. Resolves to the typed password (checked on the server), or null if cancelled.
 */
export function useConfirmWithPassword() {
  const context = use(ConfirmContext);
  if (!context)
    throw new Error("useConfirmWithPassword must be used inside <ConfirmProvider>");
  return context.confirmWithPassword;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const [request, setRequest] = useState<Request | null>(null);
  const [password, setPassword] = useState("");
  const pending = useRef<Request | null>(null);

  const open = useCallback((next: Request) => {
    // A new question cancels any unanswered one.
    const previous = pending.current;
    if (previous?.kind === "confirm") previous.resolve(false);
    if (previous?.kind === "password") previous.resolve(null);
    pending.current = next;
    setPassword("");
    setRequest(next);
  }, []);

  const value = useMemo(
    () => ({
      confirm: (options: ConfirmOptions) =>
        new Promise<boolean>((resolve) => open({ kind: "confirm", options, resolve })),
      confirmWithPassword: (options: PasswordOptions) =>
        new Promise<string | null>((resolve) =>
          open({ kind: "password", options, resolve }),
        ),
    }),
    [open],
  );

  const settle = (accepted: boolean) => {
    const current = pending.current;
    pending.current = null;
    if (current?.kind === "confirm") current.resolve(accepted);
    if (current?.kind === "password") current.resolve(accepted ? password : null);
    setRequest(null);
    setPassword("");
  };

  const options = request?.options;
  const danger = options?.tone !== "default";
  const passwordId = useId();

  return (
    <ConfirmContext value={value}>
      {children}
      <Dialog
        open={request !== null}
        onClose={() => settle(false)}
        title={
          <span className="flex items-center gap-3">
            {danger ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-danger/12 text-danger">
                <AlertTriangle className="size-4.5" aria-hidden />
              </span>
            ) : null}
            {options?.title}
          </span>
        }
        description={options?.description}
        closeLabel={t("close")}
        className="w-[min(92vw,28rem)]"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            settle(true);
          }}
          className="grid gap-5"
        >
          {request?.kind === "password" ? (
            <Field
              label={request.options.passwordLabel}
              htmlFor={passwordId}
              hint={request.options.passwordHint}
            >
              <Input
                id={passwordId}
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          ) : null}
          <div className="flex flex-wrap-reverse justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => settle(false)}
              autoFocus={request?.kind !== "password"}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant={danger ? "danger" : "primary"}
              disabled={request?.kind === "password" && !password}
            >
              {options?.confirmLabel}
            </Button>
          </div>
        </form>
      </Dialog>
    </ConfirmContext>
  );
}
