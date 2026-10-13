"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-2 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-bg-3 text-text-1 [&>svg]:size-5">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-[15px] font-semibold text-text-0">{title}</p>
        {description && <p className="mx-auto max-w-sm text-[13px] leading-relaxed text-text-2">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}