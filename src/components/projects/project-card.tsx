"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/lib/types";

export interface ProjectStat {
  open: number;
  inProgress: number;
  resolved: number;
  total: number;
}

export function ProjectCard({
  project,
  stats,
  index = 0,
}: {
  project: Project;
  stats?: ProjectStat;
  index?: number;
}) {
  const archived = project.is_archived;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
    >
      <Link href={`/app/projects/${project.slug}`} className="group block">
        <Card className="relative h-full overflow-hidden p-5 transition-all duration-200 group-hover:border-line-2 group-hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300">
              <Bug className="size-4" />
            </span>
            {archived && <Badge className="border-line-1 bg-bg-3 text-text-2">Archived</Badge>}
            <ArrowUpRight className="size-4 text-text-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text-0" />
          </div>

          <h3 className="mt-4 truncate text-[15px] font-semibold tracking-tight text-text-0">
            {project.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 min-h-[2.5em] text-[13px] leading-snug text-text-2">
            {project.description || "No description yet."}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-line-0 pt-3">
            <div className="flex items-center gap-2.5">
              {stats ? (
                <>
                  <Badge className="h-[20px] gap-1 border-line-1 bg-bg-3 px-1.5 text-[11px] text-text-2">
                    <span className="size-1.5 rounded-full bg-text-1" />
                    {stats.open} open
                  </Badge>
                  <Badge className="h-[20px] gap-1 border-info/15 bg-info/8 px-1.5 text-[11px] text-info">
                    <span className="size-1.5 animate-pulse-dot rounded-full bg-info" />
                    {stats.inProgress} in progress
                  </Badge>
                </>
              ) : (
                <Badge className="h-[20px] border-line-1 bg-bg-3 px-1.5 text-[11px] text-text-2">
                  Loading…
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-text-3">updated {timeAgo(project.updated_at)}</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}