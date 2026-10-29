import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormMessage({
  tone,
  children,
}: {
  tone: "error" | "success";
  children?: string;
}) {
  if (!children) return null;
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
        tone === "error"
          ? "border-danger/30 bg-danger/8 text-danger"
          : "border-success/30 bg-success/8 text-success",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}
