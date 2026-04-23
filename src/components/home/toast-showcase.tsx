"use client";

import { appToast } from "@/lib/toast";
import { useAppContext } from "@/context/app-context";

export const ToastShowcase = () => {
  const { locale } = useAppContext();
  const isFa = locale === "fa";

  const labels = isFa
    ? {
        title: "دموی سیستم Toast",
        success: "موفق",
        error: "خطا",
        info: "اطلاعات",
        warning: "هشدار",
      }
    : {
        title: "Toast System Demo",
        success: "Success",
        error: "Error",
        info: "Info",
        warning: "Warning",
      };

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
        {labels.title}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            appToast.success({
              title: isFa ? "عملیات موفق بود" : "Action completed",
              description: isFa
                ? "همه چیز با موفقیت انجام شد."
                : "Everything finished smoothly.",
            })
          }
          className="btn-semantic btn-semantic--success"
        >
          {labels.success}
        </button>
        <button
          type="button"
          onClick={() =>
            appToast.error({
              title: isFa ? "عملیات ناموفق بود" : "Action failed",
              description: isFa ? "لطفا دوباره تلاش کن." : "Please try again.",
            })
          }
          className="btn-semantic btn-semantic--error"
        >
          {labels.error}
        </button>
        <button
          type="button"
          onClick={() =>
            appToast.info({
              title: isFa ? "یک نکته مهم" : "Heads up",
              description: isFa
                ? "این toast با framer motion انیمیشن دارد."
                : "This toast uses Framer Motion micro-animations.",
            })
          }
          className="btn-semantic btn-semantic--info"
        >
          {labels.info}
        </button>
        <button
          type="button"
          onClick={() =>
            appToast.warning({
              title: isFa ? "هشدار مهم" : "Important warning",
              description: isFa
                ? "قبل از ادامه، تنظیماتت را یکبار بررسی کن."
                : "Review your settings once before continuing.",
            })
          }
          className="btn-semantic btn-semantic--warning"
        >
          {labels.warning}
        </button>
      </div>
    </div>
  );
};
