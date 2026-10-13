"use client";

import { motion } from "framer-motion";
import { GripVertical, MessageSquare } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { PriorityBadge } from "@/components/bugs/priority-badge";
import { Avatar } from "@/components/ui/avatar";
import type { Bug as BugItem } from "@/lib/types";
import { bugStatusMeta } from "@/lib/constants";

export interface AssigneeInfo {
  id: number;
  name?: string | null;
  email?: string;
}

export function BugCard({
  bug,
  assignee,
  commentCount,
  onClick,
  compact = false,
}: {
  bug: BugItem;
  assignee?: AssigneeInfo | null;
  commentCount?: number;
  onClick?: () => void;
  compact?: boolean;
}) {
  const resolved = bug.status === "resolved" || bug.status === "closed";
  const meta = bugStatusMeta(bug.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        }}
        className={cn(
          "group relative cursor-pointer rounded-md border border-line-1 bg-bg-2 p-2.5 shadow-sm transition-colors duration-150",
          "hover:border-line-2 hover:shadow-md focus-visible:outline-none focus-visible:ring-brand",
          compact && "p-2",
        )}
        aria-label={bug.title}
      >
        <div className="flex items-start gap-2">
          <span className="mt-0.5 font-mono text-[11px] tabular-nums text-text-3">#{bug.id}</span>
          <p
            className={cn(
              "min-w-0 flex-1 text-[13px] leading-snug text-text-0",
              resolved && "text-text-2 line-through decoration-text-3",
            )}
          >
            {bug.title}
          </p>
          <GripVertical className="mt-0.5 size-3.5 shrink-0 text-text-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className={cn("flex items-center justify-between gap-2", compact ? "mt-2" : "mt-2.5")}>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={bug.priority} />
          </div>
          <div className="flex items-center gap-1.5">
            {commentCount !== undefined && commentCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-text-3">
                <MessageSquare className="size-3" />
                {commentCount}
              </span>
            )}
            {assignee ? (
              <Avatar
                name={assignee.name}
                email={assignee.email}
                size="xs"
                className={cn("ring-1 ring-line-1", meta.dotClass === "bg-text-3" && "opacity-40")}
              />
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full border border-dashed border-line-2 text-text-3">
                <span className="sr-only">Unassigned</span>
              </span>
            )}
          </div>
        </div>

        <p className={cn("mt-2 text-[10px] text-text-3", compact && "hidden")}>{timeAgo(bug.created_at)}</p>
      </div>
    </motion.div>
  );
}