import { Users } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge, EmptyState } from "@/components/ui";
import type { UserListItem } from "../services/queries";
import { UserRowActions } from "./user-row-actions";

const statusTone = {
  active: "success",
  invited: "warning",
  suspended: "danger",
} as const;

export async function UsersTable({
  users,
  currentUserId,
}: {
  users: UserListItem[];
  currentUserId: string;
}) {
  const t = await getTranslations("admin.users");
  const format = await getFormatter();

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t("empty.title")}
        description={t("empty.description")}
      />
    );
  }

  // relative: absolutely positioned bits inside (e.g. sr-only labels) must scroll with
  // the table instead of escaping it and widening the page on phones.
  return (
    <div className="relative overflow-x-auto rounded-xl glass">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b text-start text-xs tracking-wider text-muted-foreground uppercase">
            <th className="px-5 py-4 text-start font-medium">{t("fields.name")}</th>
            <th className="px-5 py-4 text-start font-medium">{t("fields.status")}</th>
            <th className="px-5 py-4 text-start font-medium">{t("fields.joined")}</th>
            <th className="px-5 py-4 text-end font-medium">
              <span className="sr-only">{t("fields.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0 hover:bg-glass/50">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 font-display text-brand">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <Badge tone={statusTone[user.status]}>{t(`status.${user.status}`)}</Badge>
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {format.dateTime(user.createdAt, { dateStyle: "medium" })}
              </td>
              <td className="px-5 py-4">
                <UserRowActions user={user} isSelf={user.id === currentUserId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
