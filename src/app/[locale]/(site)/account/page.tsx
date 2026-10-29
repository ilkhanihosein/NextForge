import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@/components/ui";
import { ChangePasswordForm, SignOutButton } from "@/features/auth";
import { requireSession } from "@/features/auth/server";
import { privatePage } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const t = await getTranslations("account");
  return privatePage(t("title"));
}

export default async function AccountPage() {
  const { user } = await requireSession();
  const t = await getTranslations("account");
  const tr = await getTranslations("admin.users.roles");

  return (
    <Container className="max-w-3xl pt-16">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        actions={<SignOutButton withLabel />}
      />
      <div className="grid gap-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-5">
            <span className="grid size-16 place-items-center rounded-full bg-brand/10 font-display text-2xl text-brand">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl">{user.name}</p>
              <p className="text-sm text-muted-foreground" dir="ltr">
                {user.email}
              </p>
            </div>
            <Badge tone="brand">{tr(user.role as "admin")}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("passwordTitle")}</CardTitle>
            <CardDescription>{t("passwordDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
