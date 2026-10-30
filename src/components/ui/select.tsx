"use client";

import { Select as Base } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fieldBase } from "./input";

export type SelectOption = {
  value: string;
  label: ReactNode;
  /** A second, muted line under the label (only in the list, not in the field). */
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Text for type-ahead when `label` isn't a plain string. */
  textValue?: string;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submits the value with the form, like a native <select name>. */
  name?: string;
  /** Lands on the trigger, so <Field htmlFor> / <label for> point at it. */
  id?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  size?: "md" | "sm";
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

/**
 * A styled listbox on Base UI's headless Select: full keyboard support (arrows, Home/End,
 * type-ahead, Esc), screen-reader semantics, collision-aware positioning, touch-friendly
 * rows and a hidden input so it works in plain forms and server actions.
 */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  id,
  placeholder,
  disabled,
  required,
  size = "md",
  className,
  ...aria
}: SelectProps) {
  const trigger = useRef<HTMLButtonElement>(null);
  // Inside a modal <dialog> everything outside it is inert, so the list must open inside
  // the dialog rather than at the end of <body>.
  const [container, setContainer] = useState<HTMLElement | undefined>();

  return (
    <Base.Root
      items={options.map(({ value: v, label }) => ({ value: v, label }))}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? null) : undefined}
      onValueChange={(next) => onValueChange?.(next as string)}
      onOpenChange={(open) => {
        if (open) setContainer(trigger.current?.closest("dialog") ?? undefined);
      }}
      name={name}
      disabled={disabled}
      required={required}
    >
      <Base.Trigger
        ref={trigger}
        id={id}
        {...aria}
        className={cn(
          fieldBase,
          "group flex cursor-pointer items-center justify-between gap-2 text-start",
          "data-popup-open:border-ring data-popup-open:ring-4 data-popup-open:ring-ring/15",
          size === "sm" ? "h-9 rounded-full px-3.5" : "h-11",
          className,
        )}
      >
        <Base.Value
          placeholder={placeholder}
          className="min-w-0 flex-1 truncate data-placeholder:text-muted-foreground/70"
        />
        <Base.Icon className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180">
          <ChevronDown className="size-4" aria-hidden />
        </Base.Icon>
      </Base.Trigger>

      <Base.Portal container={container}>
        <Base.Positioner
          sideOffset={6}
          collisionPadding={12}
          alignItemWithTrigger={false}
          className="z-50 outline-none"
        >
          <Base.Popup
            // Esc closes the list only: without this a surrounding modal <dialog> takes
            // the same key press as its own close request.
            onKeyDown={(e) => {
              if (e.key === "Escape") e.preventDefault();
            }}
            className={cn(
              "min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-xl text-foreground shadow-2xl glass-strong outline-none",
              "transition-[transform,opacity] duration-150 ease-out",
              "data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            )}
          >
            <Base.List className="max-h-[min(calc(var(--available-height)-1rem),20rem)] overflow-y-auto overscroll-contain p-1.5 outline-none">
              {options.map((option) => (
                <Base.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  label={
                    option.textValue ??
                    (typeof option.label === "string" ? option.label : undefined)
                  }
                  className={cn(
                    "flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none select-none pointer-coarse:min-h-11",
                    "data-highlighted:bg-[color-mix(in_oklab,var(--brand)_13%,transparent)]",
                    "data-disabled:pointer-events-none data-disabled:opacity-40 data-selected:font-medium",
                  )}
                >
                  {option.icon ? (
                    <span className="shrink-0 text-muted-foreground [&_svg]:size-4">
                      {option.icon}
                    </span>
                  ) : null}
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <Base.ItemText className="truncate">{option.label}</Base.ItemText>
                    {option.description ? (
                      <span className="text-xs font-normal text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  <Base.ItemIndicator className="shrink-0 text-brand">
                    <Check className="size-4" aria-hidden />
                  </Base.ItemIndicator>
                </Base.Item>
              ))}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
