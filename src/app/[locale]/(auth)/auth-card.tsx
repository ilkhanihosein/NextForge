import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md animate-rise rounded-2xl p-8 glass sm:p-10">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.3em] text-brand uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 font-display text-4xl tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </div>
  );
}
