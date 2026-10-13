"use client";

import { cn } from "@/lib/utils";
import { bugStatusMeta } from "@/lib/constants";
import type { BugStatus } from "@/lib/types";

export function StatusBadge({ status, className }: { status: BugStatus; className?: string }) {
  const meta = bugStatusMeta(status);
  return (
    <span className={cn("inline-flex h-[20px] items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium", meta.chipClass, className)}>
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}