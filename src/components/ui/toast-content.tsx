"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

type ToastContentProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  variant: ToastVariant;
  onClose: () => void;
};

export const ToastContent = ({
  title,
  description,
  icon: Icon,
  variant,
  onClose,
}: ToastContentProps) => {
  return (
    <div className={cn("toast-card toast-card--interactive", `toast-card--${variant}`)}>
      <button
        type="button"
        onClick={onClose}
        className="toast-card__close"
        aria-label="Close notification"
      >
        <X className="size-4" />
      </button>

      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="toast-card__icon"
      >
        <Icon className="size-4" />
      </motion.div>
      <div>
        <p className="toast-card__title text-sm font-semibold">{title}</p>
        {description ? (
          <motion.p
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.04 }}
            className="mt-1 text-xs leading-6 opacity-80"
          >
            {description}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
};
