import { cn } from "@/lib/utils";

/**
 * The ambient backdrop behind every glass surface: slow-drifting colour fields plus a
 * film-grain overlay. Pure CSS, fixed and GPU-composited, so it costs no JS.
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "grain pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,var(--background)_0%,var(--background-deep)_100%)]" />
      <div className="absolute -start-[15%] -top-[20%] size-[60vmax] animate-float rounded-full bg-[radial-gradient(circle,var(--aurora-1),transparent_65%)] blur-3xl" />
      <div className="absolute -end-[20%] top-[10%] size-[55vmax] animate-float rounded-full bg-[radial-gradient(circle,var(--aurora-2),transparent_65%)] blur-3xl [animation-delay:-5s]" />
      <div className="absolute start-[20%] -bottom-[30%] size-[50vmax] animate-float rounded-full bg-[radial-gradient(circle,var(--aurora-3),transparent_65%)] blur-3xl [animation-delay:-9s]" />
    </div>
  );
}
