import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { AdminSidebar } from "@/features/admin";
import { requireAdmin } from "@/features/auth/server";
import { privatePage } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return privatePage((await getTranslations("admin.nav"))("label"));
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <>
      <SiteHeader />
      <Container className="grid gap-6 pt-6 pb-16 lg:grid-cols-[15rem_1fr]">
        <AdminSidebar userName={user.name} />
        <div className="min-w-0 animate-fade">{children}</div>
      </Container>
    </>
  );
}
