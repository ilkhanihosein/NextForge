import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersList } from "@/features/users";
import { siteConfig, type Locale } from "@/config/site";

type UsersIndexPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function UsersIndexPage({ params }: UsersIndexPageProps) {
  const { locale } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link
            href={`/${typedLocale}`}
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Home
          </Link>
          <Link
            href={`/${typedLocale}#module-posts`}
            className="text-brand underline-offset-4 hover:underline"
          >
            Posts module
          </Link>
        </div>
      </div>
      <UsersList limit={12} />
    </section>
  );
}
