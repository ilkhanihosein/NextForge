import Link from "next/link";
import { PostsPreview } from "@/components/home/posts-preview";
import { StarterStackCards } from "@/components/home/starter-stack-cards";
import { UsersPreview } from "@/components/home/users-preview";
import { ToastShowcase } from "@/components/home/toast-showcase";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";

type FeaturePlaygroundProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const actionClass =
  "inline-flex items-center justify-center rounded-lg border border-border bg-panel px-3 py-2 text-xs font-semibold text-foreground transition hover:border-brand/50 hover:bg-muted";

export function FeaturePlayground({ locale, dictionary }: FeaturePlaygroundProps) {
  const h = dictionary.home;
  const base = `/${locale}`;

  return (
    <section
      id="features-playground"
      className="scroll-mt-24 border-t border-border/60 pt-12"
      aria-label={h.featuresTitle}
    >
      <div className="mb-2 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {h.heroKicker}
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-panel/50 to-transparent p-6 md:p-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {h.stackTitle}
        </h2>
        <p className="mt-2 max-w-3xl pb-6 text-sm text-muted-foreground md:pb-8">
          {h.stackAtAGlance}
        </p>
        <StarterStackCards variant="default" showHeading={false} />
      </div>

      <div className="mt-12 border-t border-border/60 pt-10">
        <div className="mb-8 max-w-3xl">
          <h2
            id="reference-features-heading"
            className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            {h.featuresTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {h.featuresSubtitle}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-border/70 bg-background/80 p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{h.postsTitle}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
                  {h.postsDescription}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {h.livePreview}
            </p>
            <div className="mt-2 min-h-[140px] rounded-xl border border-border/50 bg-panel/50 p-3">
              <PostsPreview />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`${base}/posts/1`} className={actionClass}>
                {h.openPostById}
              </Link>
              <Link href={`${base}/posts/2`} className={actionClass}>
                {h.openPostById2}
              </Link>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl border border-border/70 bg-background/80 p-5 shadow-soft">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{h.usersTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">
                {h.usersDescription}
              </p>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {h.livePreview}
            </p>
            <div className="mt-2 min-h-[140px] rounded-xl border border-border/50 bg-panel/50 p-3">
              <UsersPreview />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`${base}/users`} className={actionClass}>
                {h.openUsersIndex}
              </Link>
              <Link href={`${base}/users/1`} className={actionClass}>
                {h.openUserById}
              </Link>
            </div>
          </article>

          <article
            id="toast-demo"
            className="scroll-mt-24 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-soft lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-foreground">{h.toastBlockTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.toastBlockDescription}
            </p>
            <div className="mt-4">
              <ToastShowcase />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
