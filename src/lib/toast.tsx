"use client";

import {
  CheckCircle2,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ToastContent } from "@/components/ui/toast-content";

type ToastPayload = {
  title: string;
  description?: string;
};

export const appToast = {
  success: ({ title, description }: ToastPayload) =>
    toast.custom((toastId) => (
      <ToastContent
        title={title}
        description={description}
        icon={CheckCircle2}
        variant="success"
        onClose={() => toast.dismiss(toastId)}
      />
    )),

  error: ({ title, description }: ToastPayload) =>
    toast.custom((toastId) => (
      <ToastContent
        title={title}
        description={description}
        icon={XCircle}
        variant="error"
        onClose={() => toast.dismiss(toastId)}
      />
    )),

  warning: ({ title, description }: ToastPayload) =>
    toast.custom((toastId) => (
      <ToastContent
        title={title}
        description={description}
        icon={TriangleAlert}
        variant="warning"
        onClose={() => toast.dismiss(toastId)}
      />
    )),

  info: ({ title, description }: ToastPayload) =>
    toast.custom((toastId) => (
      <ToastContent
        title={title}
        description={description}
        icon={Info}
        variant="info"
        onClose={() => toast.dismiss(toastId)}
      />
    )),

  loading: ({ title, description }: ToastPayload) =>
    toast.custom((toastId) => (
      <div className="toast-card toast-card--loading">
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          className="toast-card__close"
          aria-label="Close notification"
        >
          <X className="size-4" />
        </button>
        <LoaderCircle className="toast-card__spinner mt-1 size-4 animate-spin" />
        <div>
          <p className="toast-card__title text-sm font-semibold">{title}</p>
          {description ? <p className="mt-1 text-xs opacity-80">{description}</p> : null}
        </div>
      </div>
    )),
};
