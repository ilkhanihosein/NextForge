"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, use, useCallback, useRef, useState, type ReactNode } from "react";
import { Button } from "./button";
import { Dialog } from "./dialog";

type ConfirmOptions = {
  title: ReactNode;
  description?: ReactNode;
  /** The verb on the button: "Delete", "Suspend"… never just "OK". */
  confirmLabel: string;
  /** "danger" for anything destructive or hard to undo. */
  tone?: "danger" | "default";
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/**
 * `const confirm = useConfirm(); if (await confirm({...})) doIt();`
 * One dialog for the whole app, styled like the rest of it (unlike window.confirm),
 * translated, keyboard friendly, and Esc / backdrop / Cancel all mean "no".
 */
export function useConfirm() {
  const confirm = use(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>(
    (next) =>
      new Promise((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOptions(next);
      }),
    [],
  );

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const danger = options?.tone !== "default";

  return (
    <ConfirmContext value={confirm}>
      {children}
      <Dialog
        open={options !== null}
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
        <div className="flex flex-wrap-reverse justify-end gap-2">
          <Button variant="ghost" onClick={() => settle(false)} autoFocus>
            {t("cancel")}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={() => settle(true)}>
            {options?.confirmLabel}
          </Button>
        </div>
      </Dialog>
    </ConfirmContext>
  );
}
