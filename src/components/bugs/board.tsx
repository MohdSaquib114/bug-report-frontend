"use client";

import { useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Bug as BugIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUG_STATUSES, bugStatusMeta } from "@/lib/constants";
import { BugCard, type AssigneeInfo } from "@/components/bugs/bug-card";
import { updateBug } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/utils";
import type { Bug, BugPriority, BugStatus } from "@/lib/types";

export interface BoardFilters {
  priority?: BugPriority | "all";
  assigneeId?: number;
  search?: string;
}

function matchesFilters(bug: Bug, filters: BoardFilters): boolean {
  if (filters.priority && filters.priority !== "all" && bug.priority !== filters.priority) return false;
  if (filters.assigneeId && bug.assignee_id !== filters.assigneeId) return false;
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    if (!bug.title.toLowerCase().includes(q) && !String(bug.id).includes(q)) return false;
  }
  return true;
}

export function Board({
  bugs,
  members,
  onBugUpdated,
  onOpenBug,
  filters = {},
}: {
  bugs: Bug[];
  members: AssigneeInfo[];
  onBugUpdated: (bug: Bug) => void;
  onOpenBug: (bug: Bug) => void;
  filters?: BoardFilters;
}) {
  const { toast } = useToast();
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<BugStatus | null>(null);
  const [pending, setPending] = useState<{ id: number; to: BugStatus } | null>(null);

  const assigneeOf = (bug: Bug): AssigneeInfo | null =>
    bug.assignee_id ? members.find((m) => m.id === bug.assignee_id) ?? null : null;

  const grouped = useMemo(() => {
    const map: Record<BugStatus, Bug[]> = {
      open: [],
      in_progress: [],
      resolved: [],
      closed: [],
    };
    for (const bug of bugs) {
      map[bug.status]?.push(bug);
    }
    const filtered: Record<BugStatus, Bug[]> = { ...map };
    for (const key of Object.keys(filtered) as BugStatus[]) {
      filtered[key] = filtered[key].filter((b) => matchesFilters(b, filters));
    }
    return { all: map, visible: filtered };
  }, [bugs, filters]);

  const counts = useMemo(() => {
    const c: Record<BugStatus, number> = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    for (const bug of bugs) c[bug.status] = (c[bug.status] ?? 0) + 1;
    return c;
  }, [bugs]);

  const handleDrop = async (bug: Bug, to: BugStatus) => {
    setDraggingId(null);
    setDragOver(null);
    if (bug.status === to) return;

    const previous = bugs;
    onBugUpdated({ ...bug, status: to });
    setPending({ id: bug.id, to });

    try {
      const updated = await updateBug(bug.id, { status: to });
      onBugUpdated(updated);
      toast({
        title: "Status moved",
        description: `#${bug.id} → ${bugStatusMeta(to).label.toLowerCase()}.`,
        tone: "success",
      });
    } catch (error) {
      onBugUpdated(bug);
      toast({ title: "Update failed", description: getErrorMessage(error), tone: "error" });
      void previous;
    } finally {
      setPending(null);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex gap-3 overflow-x-auto pb-4">
        {BUG_STATUSES.map((column) => {
          const items = grouped.visible[column.key];
          const total = counts[column.key];
          const empty = items.length === 0 && total === 0;
          const over = dragOver === column.key;

          return (
            <div
              key={column.key}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOver !== column.key) setDragOver(column.key);
              }}
              onDragLeave={() => setDragOver((prev) => (prev === column.key ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                const id = Number(e.dataTransfer.getData("text/bugdrop-id"));
                const bug = bugs.find((b) => b.id === id);
                if (bug) void handleDrop(bug, column.key);
              }}
              className={cn(
                "flex w-[272px] shrink-0 flex-col rounded-lg border border-line-0 bg-bg-1/60 transition-colors duration-150",
                over && "border-brand-500/40 bg-brand-500/[0.04]",
              )}
            >
              <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                <span className={cn("size-1.5 rounded-full", column.dotClass)} />
                <span className="text-xs font-semibold text-text-0">{column.columnTitle}</span>
                <span className="ml-auto rounded-full bg-bg-3 px-1.5 py-px font-mono text-[11px] tabular-nums text-text-2">
                  {total}
                </span>
              </div>
              <p className="px-3 pb-2 text-[11px] text-text-3">{column.columnHint}</p>

              <div className="flex min-h-[120px] flex-1 flex-col gap-2 rounded-b-lg px-2 pb-2">
                {items.length === 0 && !empty && (
                  <p className="p-3 text-center text-xs text-text-3">No bugs match the current filters.</p>
                )}
                {empty && (
                  <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line-2 p-4 text-center">
                    <BugIcon className="size-4 text-text-3" />
                    <p className="text-xs text-text-3">Nothing here yet</p>
                  </div>
                )}
                {items.map((bug) => (
                  <div
                    key={bug.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/bugdrop-id", String(bug.id));
                      setDraggingId(bug.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOver(null);
                    }}
                    className={cn(
                      "rounded-md",
                      draggingId === bug.id && "opacity-30",
                      pending?.id === bug.id && "opacity-60",
                    )}
                  >
                    <BugCard
                      bug={bug}
                      assignee={assigneeOf(bug)}
                      onClick={() => onOpenBug(bug)}
                      compact
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}