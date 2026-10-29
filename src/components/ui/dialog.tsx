"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  closeLabel?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Built on the native <dialog>: focus trapping, Esc and the top layer come from the
 * browser, so no positioning library is needed.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  closeLabel = "Close",
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[min(92vw,32rem)] rounded-xl p-0 text-foreground glass-strong",
        "backdrop:bg-midnight-950/40 backdrop:backdrop-blur-sm open:animate-rise",
        className,
      )}
    >
      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="grid gap-1.5">
            <h2 className="font-display text-2xl tracking-tight">{title}</h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-me-2 -mt-1 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  );
}
