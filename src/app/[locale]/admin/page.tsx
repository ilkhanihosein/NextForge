import { ShieldCheck, UserCheck, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { StatCard } from "@/features/admin";
import { requireAdmin } from "@/features/auth/server";
import { countUsersByRole } from "@/features/users/server";

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();
  const t = await getTranslations("admin.dashboard");
  const counts = await countUsersByRole();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title", { name: user.name.split(" ")[0] ?? user.name })}
        description={t("description")}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label={t("stats.users")} value={total} />
        <StatCard
          icon={UserCheck}
          label={t("stats.members")}
          value={counts.member ?? 0}
        />
        <StatCard
          icon={ShieldCheck}
          label={t("stats.admins")}
          value={(counts.admin ?? 0) + (counts.owner ?? 0)}
        />
      </div>
    </>
  );
}
