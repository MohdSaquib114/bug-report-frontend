"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Bug, Code2, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard, type ProjectStat } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { useAuth } from "@/lib/auth";
import { listProjects, listBugs } from "@/lib/api";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";

export default function OverviewPage() {
  const { user, status } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Record<number, ProjectStat>>({});
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listProjects({ include_archived: false });
      setProjects(all);
      const next: Record<number, ProjectStat> = {};
      await Promise.all(
        all.map(async (project) => {
          try {
            const bugs = await listBugs(project.slug, { limit: 100 });
            next[project.id] = {
              open: bugs.filter((b) => b.status === "open").length,
              inProgress: bugs.filter((b) => b.status === "in_progress").length,
              resolved: bugs.filter((b) => b.status === "resolved").length,
              total: bugs.length,
            };
          } catch {
            next[project.id] = { open: 0, inProgress: 0, resolved: 0, total: 0 };
          }
        }),
      );
      setStats(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = Object.values(stats).reduce(
    (acc, s) => ({
      open: acc.open + s.open,
      inProgress: acc.inProgress + s.inProgress,
      resolved: acc.resolved + s.resolved,
      total: acc.total + s.total,
    }),
    { open: 0, inProgress: 0, resolved: 0, total: 0 },
  );

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const greeting = status === "authenticated" ? `Hey, ${firstName}` : "Workspace overview";

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        title={greeting}
        description="A pulse-check on everything you're triaging."
        actions={
          <Button asChild variant="secondary">
            <Link href="/demo">
              <Code2 className="size-4" />
              See the widget in action
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mt-6 grid gap-4 sm:grid-cols-3"
        >
          <StatCard label="Open bugs" dot="bg-text-1" value={totals.open} accent={false} />
          <StatCard label="In progress" dot="bg-info animate-pulse-dot" value={totals.inProgress} accent={false} />
          <StatCard label="Resolved overall" dot="bg-accent" value={totals.resolved} accent />
        </motion.div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold tracking-tight text-text-0">Your projects</h2>
        <Button variant="ghost" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-3.5" />
          New project
        </Button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyStatePanel onOpenCreate={() => setCreateOpen(true)} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => (
              <ProjectCard key={project.id} project={project} stats={stats[project.id]} index={i} />
            ))}
            {projects.length > 3 && (
              <Link
                href="/app/projects"
                className="group flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-2 text-text-2 transition-colors duration-200 hover:border-line-2 hover:bg-bg-1 hover:text-text-1"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-bg-3">
                  <Users className="size-4" />
                </span>
                <span className="text-sm font-medium">
                  {projects.length - 3} more project{projects.length - 3 > 1 ? "s" : ""}
                </span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      <ProjectFormDialog open={createOpen} onOpenChange={setCreateOpen} onSubmit={async () => {}} />
    </div>
  );
}

function StatCard({
  label,
  value,
  dot,
  accent,
}: {
  label: string;
  value: number;
  dot: string;
  accent: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line-1 bg-bg-2 p-5",
        accent && "border-accent/15 bg-accent/[0.03]",
      )}
    >
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-text-2">
        <span className={cn("size-1.5 rounded-full", dot)} />
        {label}
      </p>
      <p className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight", accent ? "text-accent" : "text-text-0")}>
        {value}
      </p>
    </div>
  );
}

function EmptyStatePanel({ onOpenCreate }: { onOpenCreate: () => void }) {
  return (
    <div className="rounded-lg border border-line-1 bg-bg-2 p-8">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p className="text-[15px] font-semibold text-text-0">Two steps to your first report</p>
          <ol className="mt-5 space-y-5">
            {[
              {
                icon: Plus,
                title: "Create a project",
                body: "Projects hold the reports your widget collects. One per product or site.",
                action: (
                  <Button size="sm" onClick={onOpenCreate}>
                    <Plus className="size-3.5" />
                    Create project
                  </Button>
                ),
              },
              {
                icon: Bug,
                title: "Embed the widget",
                body: "Install bug-widget-library, drop in <Widget>, and reports start landing on the board.",
                action: (
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/docs/installation">
                      Read the install guide
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                ),
              },
            ].map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-3 text-text-1">
                  <step.icon className="size-4" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-text-0">
                    <span className="font-mono text-[11px] text-text-3">{`0${i + 1}`}</span>
                    {step.title}
                  </p>
                  <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-text-2">{step.body}</p>
                  <div className="mt-2.5">{step.action}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-2">
          <Badge className="border-line-1 bg-bg-3 text-text-2">Quick start</Badge>
          <CodeBlock
            compact
            title="terminal"
            code={`npx create-next-app@latest my-app\ncd my-app\nnpm i bug-widget-library\n# then embed <Widget …/>`}
          />
        </div>
      </div>
    </div>
  );
}