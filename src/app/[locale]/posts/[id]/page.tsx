import { notFound } from "next/navigation";
import { PostDetail } from "@/features/posts";
import { siteConfig, type Locale } from "@/config/site";

type PostPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { locale, id } = await params;
  if (!siteConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <PostDetail postId={postId} />
    </section>
  );
}
