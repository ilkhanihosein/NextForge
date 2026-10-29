import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Input, PageHeader } from "@/components/ui";
import { requireAdmin } from "@/features/auth/server";
import { InviteUserDialog, UsersTable } from "@/features/users";
import { listUsers } from "@/features/users/server";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { user } = await requireAdmin();
  const { q, page } = await searchParams;
  const t = await getTranslations("admin.users");
  const result = await listUsers({ query: q, page: Number(page) || 1 });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description", { count: result.total })}
        actions={<InviteUserDialog />}
      />
      <form role="search" className="relative mb-5 max-w-sm">
        <Search
          className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="q"
          defaultValue={q}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="ps-11"
        />
      </form>
      <UsersTable users={result.items} currentUserId={user.id} />
    </>
  );
}
