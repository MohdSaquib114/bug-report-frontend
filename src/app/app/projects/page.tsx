"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Archive, TerminalSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProjectCard, type ProjectStat } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { listProjects, createProject, listBugs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Record<number, ProjectStat>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"active" | "archived">("active");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listProjects({ include_archived: true });
      setProjects(all);
      const withStats: Record<number, ProjectStat> = {};
      await Promise.all(
        all.map(async (project) => {
          try {
            const bugs = await listBugs(project.slug, { limit: 100 });
            withStats[project.id] = {
              open: bugs.filter((b) => b.status === "open").length,
              inProgress: bugs.filter((b) => b.status === "in_progress").length,
              resolved: bugs.filter((b) => b.status === "resolved").length,
              total: bugs.length,
            };
          } catch {
            withStats[project.id] = { open: 0, inProgress: 0, resolved: 0, total: 0 };
          }
        }),
      );
      setStats(withStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (values: { name: string; slug?: string; description?: string | null }) => {
    setCreating(true);
    try {
      await createProject(values);
      await load();
      void 0;
    } finally {
      setCreating(false);
    }
  };

  const visible = projects.filter((p) => (view === "archived" ? p.is_archived : !p.is_archived));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        title={`Projects${user ? `, ${user.full_name?.split(" ")[0] ?? ""}` : ""}`}
        description="Every project is a separate stream of bug reports."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            New project
          </Button>
        }
      />

      <Tabs
        className="mt-6"
        active={view}
        onActiveChange={(tab) => setView(tab as "active" | "archived")}
        tabs={[
          { key: "active", label: "Active", count: projects.filter((p) => !p.is_archived).length },
          { key: "archived", label: "Archived", count: projects.filter((p) => p.is_archived).length },
        ]}
      />

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-lg" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={view === "archived" ? <Archive className="size-5" /> : <TerminalSquare className="size-5" />}
            title={view === "archived" ? "Nothing archived yet" : "No projects yet"}
            description={
              view === "archived"
                ? "Projects you archive will show up here. Archived data is kept, never deleted."
                : "Create your first project, embed the widget, and watch reports roll in."
            }
            action={
              view === "active" ? (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  Create your first project
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} stats={stats[project.id]} index={i} />
            ))}
          </div>
        )}
      </div>

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        submitting={creating}
        onSubmit={handleCreate}
      />
    </div>
  );
}