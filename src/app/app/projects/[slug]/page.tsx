"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bug as BugIcon,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Users,
  ClipboardCopy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/bugs/status-badge";
import { Board, type BoardFilters } from "@/components/bugs/board";
import { BugComposeDialog } from "@/components/bugs/bug-compose-dialog";
import { MembersPanel } from "@/components/projects/members-panel";
import { SettingsPanel } from "@/components/projects/settings-panel";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import {
  getProject,
  listBugs,
  listProjectMembers,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn, getErrorMessage } from "@/lib/utils";
import { BUG_PRIORITIES } from "@/lib/constants";
import type { Bug, Project, ProjectMember } from "@/lib/types";

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tab, setTab] = useState("board");
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filters, setFilters] = useState<BoardFilters>({ priority: "all" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [proj, bugList, memberList] = await Promise.all([
        getProject(slug),
        listBugs(slug, { limit: 100 }),
        listProjectMembers(slug),
      ]);
      setProject(proj);
      setBugs(bugList);
      setMembers(memberList);
    } catch (error) {
      toast({ title: "Couldn't load project", description: getErrorMessage(error), tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const refreshBugs = useCallback(() => {
    void listBugs(slug, { limit: 100 })
      .then(setBugs)
      .catch((e) => toast({ title: "Refresh failed", description: getErrorMessage(e), tone: "error" }));
  }, [slug, toast]);

  const myRole = useMemo(() => {
    if (!user) return undefined;
    if (project?.owner_id === user.id) return "owner";
    return members.find((m) => m.user_id === user.id)?.role;
  }, [user, project, members]);

  const canManage = roleRank(myRole) >= rankOf("maintainer");
  const canCreate = roleRank(myRole) >= rankOf("contributor");

  const widgetUrl = typeof window !== "undefined"
    ? `${window.location.origin}/demo?project=${project?.slug ?? ""}`
    : "";

  const copyWidget = async () => {
    try {
      await navigator.clipboard.writeText(widgetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-96" />
        <Skeleton className="mt-8 h-[420px] rounded-lg" />
      </div>
    );
  }

  if (!project) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-text-2">Project not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/app/projects"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-2 transition-colors hover:text-text-0"
      >
        <ArrowLeft className="size-3.5" />
        Projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-text-0">{project.name}</h1>
            {project.is_archived && <StatusBadge status="closed" className="translate-y-0.5" />}
          </div>
          <p className="mt-1 max-w-xl text-sm text-text-2">
            {project.description || "No description — add one in Settings."}
          </p>
          <p className="mt-1.5 font-mono text-xs text-text-3">apps/{project.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Button onClick={() => setComposeOpen(true)}>
              <Plus className="size-4" />
              Report a bug
            </Button>
          )}
          <Button variant="secondary" onClick={() => setWidgetOpen(true)}>
            <BugIcon className="size-4" />
            Widget
          </Button>
        </div>
      </div>

      <Tabs
        className="mt-8"
        active={tab}
        onActiveChange={setTab}
        tabs={[
          { key: "board", label: "Board", count: bugs.length, icon: <SlidersHorizontal /> },
          { key: "members", label: "Members", count: members.length, icon: <Users /> },
          { key: "settings", label: "Settings", icon: <Settings2 /> },
        ]}
      />

      <div className="mt-6">
        {tab === "board" && (
          <div>
            <FiltersBar
              filters={filters}
              onChange={setFilters}
              members={members}
              hasAssignees={bugs.some((b) => b.assignee_id != null)}
            />
            <div className="mt-4">
              <Board
                bugs={bugs}
                members={members.map((m) => ({ id: m.user_id, name: m.user.full_name, email: m.user.email }))}
                onBugUpdated={(bug) =>
                  setBugs((prev) => prev.map((b) => (b.id === bug.id ? bug : b)))
                }
                onOpenBug={(bug) => {
                  router.push(`/app/projects/${slug}/bugs/${bug.id}`);
                }}
                filters={filters}
              />
            </div>
            <p className="mt-6 rounded-lg border border-line-1 bg-bg-2 px-4 py-3 text-[13px] text-text-2">
              Drag a bug to change its status. Reports from your embedded widget land in{" "}
              <span className="font-medium text-text-0">Open</span> automatically.
            </p>
          </div>
        )}

        {tab === "members" && <MembersPanel slug={slug} canManage={canManage} />}

        {tab === "settings" && <SettingsPanel project={project} canManage={canManage} />}
      </div>

      <BugComposeDialog open={composeOpen} onOpenChange={setComposeOpen} slug={slug} onCreated={refreshBugs} />

      <Dialog
        open={widgetOpen}
        onOpenChange={setWidgetOpen}
        title="Shareable demo link"
        description="Open this page to try the widget against this project, or copy the snippet."
      >
        <div className="space-y-4">
          <div>
            <p className="text-[13px] font-medium text-text-1">Live demo page</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-line-2 bg-bg-1 px-3 py-2 font-mono text-xs text-text-1">
                {widgetUrl}
              </code>
              <Button variant="secondary" size="sm" onClick={copyWidget}>
                {copied ? <Check className="size-3.5 text-accent" /> : <ClipboardCopy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-medium text-text-1">Direct report endpoint</p>
            <code className="mt-1.5 block rounded-md border border-line-2 bg-bg-1 px-3 py-2 font-mono text-xs text-text-1">
              POST /projects/{project.slug}/bugs
            </code>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function rankOf(role?: string): number {
  const ranks: Record<string, number> = { owner: 4, maintainer: 3, contributor: 2, viewer: 1 };
  return role ? (ranks[role] ?? 0) : 0;
}

function roleRank(role?: string): number {
  return rankOf(role);
}

function FiltersBar({
  filters,
  onChange,
  members,
  hasAssignees,
}: {
  filters: BoardFilters;
  onChange: (filters: BoardFilters) => void;
  members: ProjectMember[];
  hasAssignees: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="flex flex-wrap items-center gap-2"
    >
      <div className="relative w-full max-w-xs">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-2">
          <Search className="size-4" />
        </span>
        <Input
          placeholder="Search title or ID…"
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          aria-label="Search bugs"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          className={cn("h-9 w-36")}
          value={filters.priority ?? "all"}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as BoardFilters["priority"] })}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          {BUG_PRIORITIES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </Select>
        {hasAssignees && (
          <Select
            className="h-9 w-40"
            value={filters.assigneeId ?? ""}
            onChange={(e) =>
              onChange({ ...filters, assigneeId: e.target.value ? Number(e.target.value) : undefined })
            }
            aria-label="Filter by assignee"
          >
            <option value="">All assignees</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.user.full_name || m.user.email}
              </option>
            ))}
          </Select>
        )}
      </div>
    </motion.div>
  );
}
