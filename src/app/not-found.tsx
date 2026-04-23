import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-border/70 bg-gradient-to-br from-panel/90 to-accent-soft/70 p-8 text-center shadow-soft md:p-12">
        <p className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground">
          ERROR 404
        </p>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/en"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Go to English Home
          </Link>
          <Link
            href="/fa"
            className="rounded-xl border border-border bg-panel px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand"
          >
            رفتن به خانه فارسی
          </Link>
        </div>
      </section>
    </main>
  );
}
