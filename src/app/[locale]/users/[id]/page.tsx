import { notFound } from "next/navigation";
import { UserDetail } from "@/features/users";
import { siteConfig, type Locale } from "@/config/site";

type UserPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { locale, id } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  const userId = Number(id);
  if (!Number.isFinite(userId) || userId <= 0) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <UserDetail userId={userId} />
    </section>
  );
}
