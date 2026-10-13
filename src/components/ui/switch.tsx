"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full border transition-colors duration-150",
        checked ? "border-brand-500 bg-brand-500" : "border-line-2 bg-bg-3",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 34 }}
        className={cn(
          "absolute size-[14px] rounded-full shadow-sm",
          checked ? "right-[1px] left-auto bg-white" : "left-[1px] bg-text-1",
        )}
      />
    </button>
  );
}