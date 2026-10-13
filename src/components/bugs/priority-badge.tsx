"use client";

import { AlertTriangle, Flag, Minus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { bugPriorityMeta } from "@/lib/constants";
import type { BugPriority } from "@/lib/types";

const ICONS = {
  low: Minus,
  flag: Flag,
  high: TrendingUp,
  critical: AlertTriangle,
} as const;

export function PriorityBadge({
  priority,
  className,
  outlined = false,
}: {
  priority: BugPriority;
  className?: string;
  outlined?: boolean;
}) {
  const meta = bugPriorityMeta(priority);
  const Icon = ICONS[meta.signalIcon];
  return (
    <span
      className={cn(
        "inline-flex h-[20px] items-center gap-1 rounded-md px-1.5 text-[11px] font-medium",
        meta.chipClass,
        outlined && "shadow-none",
        className,
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}