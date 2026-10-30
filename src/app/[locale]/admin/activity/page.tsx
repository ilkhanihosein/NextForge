import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { ActivityLog } from "@/features/audit";
import { listAudit } from "@/features/audit/server";
import { requireOwner } from "@/features/auth/server";

export default async function AdminActivityPage() {
  await requireOwner();
  const t = await getTranslations("admin.activity");
  const entries = await listAudit();

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <ActivityLog entries={entries} />
    </>
  );
}
