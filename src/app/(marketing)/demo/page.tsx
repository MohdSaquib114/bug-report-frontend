"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  Check,
  Cloud,
  CloudOff,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { API_URL, reportBug } from "@/lib/api";
import { cn, getErrorMessage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/toast";
import type { BugReportData } from "bug-widget-library";

const Widget = dynamic(() => import("bug-widget-library").then((m) => m.Widget), { ssr: false });

type FeedItem = BugReportData & { id: string; receivedAt: number; persisted: boolean };

const NAV_ITEMS = ["Overview", "Analytics", "Customers", "Projects", "Reports"];

export default function DemoPage() {
  const { toast } = useToast();
  const [slug, setSlug] = useState("demo");
  const [slugDraft, setSlugDraft] = useState("demo");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);

  const projectUrl = `${API_URL}/projects/${slug}/bugs`;

  const handleSubmit = useCallback(
    async (data: BugReportData) => {
      try {
        await reportBug(slug, {
          projectUrl: data.projectUrl,
          title: data.title,
          description: data.description,
          screenshots: data.screenshots,
          timestamp: data.timestamp,
          meta: data.meta,
        });
        setOnline(true);
        return;
      } catch (error) {
        setOnline(false);
        throw error;
      }
    },
    [slug],
  );

  useEffect(() => {
    if (online === true) {
      toast({
        title: "Backend online",
        description: `Reports land on the “${slug}” board.`,
        tone: "success",
      });
    }
    if (online === false) {
      toast({
        title: "Backend offline",
        description: `Couldn't reach ${API_URL}. Submit for the full widget flow once it's up.`,
        tone: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  const handleSuccess = useCallback(
    (data: BugReportData) => {
      setFeed((f) => [
        { ...data, id: crypto.randomUUID(), receivedAt: Date.now(), persisted: true },
        ...f,
      ]);
      toast({
        title: "Report created on the board",
        description: `Posted to “${slug}” with status open.`,
        tone: "success",
      });
    },
    [slug, toast],
  );

  const handleError = useCallback(
    (error: Error) => {
      toast({ title: "Report didn't send", description: getErrorMessage(error), tone: "error" });
    },
    [toast],
  );

  return (
    <div className="min-h-screen">
      <div className="border-b border-line-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-text-0">Live demo</h1>
                <Badge
                  tone={online === null ? "neutral" : online ? "lime" : "danger"}
                  dot={online === true}
                  className="ml-1"
                >
                  {online === null ? "Connecting…" : online ? "Backend online" : "Backend offline"}
                </Badge>
              </div>
              <p className="mt-1.5 max-w-xl text-sm text-text-2">
                This is the real widget from <code className="font-mono text-xs">bug-widget-library</code>. Drop a
                report and watch it land on your board.
              </p>
            </div>
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-md border border-line-2 bg-bg-2 px-3 text-[13px] font-medium text-text-1 transition-colors hover:bg-bg-3 hover:text-text-0"
            >
              <Settings className="size-4" />
              Target board
              <Badge tone="lime" className="text-[10px]">
                {slug}
              </Badge>
            </button>
          </div>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line-2 bg-bg-2 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-text-0">Reports go to</p>
                    <p className="mt-0.5 truncate font-mono text-[12px] text-text-2">{projectUrl}</p>
                  </div>
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const next = slugDraft.trim() || "demo";
                      setSlug(next);
                      toast({
                        title: "Target updated",
                        description: `Widget will post to “${next}”.`,
                        tone: "info",
                      });
                    }}
                  >
                    <span className="text-xs text-text-2">apps/</span>
                    <input
                      value={slugDraft}
                      onChange={(e) => setSlugDraft(e.target.value)}
                      placeholder="demo"
                      className="h-9 w-40 rounded-md border border-line-2 bg-bg-3 px-3 font-mono text-[13px] text-text-0 outline-none transition-all focus:border-brand-500 focus:ring-brand"
                    />
                    <button
                      type="submit"
                      className="flex h-9 items-center gap-1.5 rounded-md bg-brand-500 px-3 text-[13px] font-medium text-white transition-colors hover:bg-brand-400"
                    >
                      <Check className="size-4" />
                      Apply
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="overflow-hidden rounded-xl border border-line-1 shadow-lg">
            <MockApp />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-3 rounded-xl border border-line-1 bg-bg-2 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-brand-300" />
                  <p className="text-[13px] font-semibold text-text-0">Live report feed</p>
                </div>
                {online === true && <Cloud className="size-4 text-accent" />}
                {online === false && <CloudOff className="size-4 text-warning" />}
              </div>

              {feed.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Terminal className="size-6 text-text-3" />
                  <p className="text-[13px] text-text-2">No reports yet.</p>
                  <p className="text-xs leading-relaxed text-text-3">
                    Use the floating button on the demo app and file one.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {feed.slice(0, 8).map((item, index) => {
                      const isNew = index === 0;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="relative rounded-lg border border-line-1 bg-bg-3 p-3"
                        >
                          {isNew && (
                            <span className="absolute right-2.5 top-2.5 flex size-1.5">
                              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                            </span>
                          )}
                          <p className="line-clamp-2 pr-3 text-[13px] font-medium leading-snug text-text-0">
                            {item.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-text-2">
                            {item.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="truncate font-mono text-[10px] uppercase tracking-wide text-text-3">
                              {item.meta.url.replace(/^https?:\/\//, "").slice(0, 26)}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 font-mono text-[10px]",
                                item.persisted ? "text-accent" : "text-warning",
                              )}
                            >
                              {item.persisted ? "on board" : "local only"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Widget
        projectUrl={projectUrl}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        uiSettings={{
          position: "bottom-right",
          primaryColor: "#7C5CFF",
          buttonText: "Report a bug",
          title: "Found something broken?",
          subtitle: "Tell us what happened. Screenshots are optional — but they help a lot.",
          placeholderTitle: "Short summary",
          placeholderDescription: "What did you expect, and what actually happened?",
        }}
      />
    </div>
  );
}

function MockApp() {
  return (
    <div className="flex min-h-[560px] flex-col bg-bg-0">
      <div className="relative flex h-10 items-center gap-3 border-b border-line-0 bg-bg-2 px-4">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-accent/70" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md border border-line-1 bg-bg-0 px-3 py-1 font-mono text-[11px] text-text-2">
          app.acmecorp.io/dashboard
        </span>
        <span className="hidden items-center gap-1.5 rounded-full border border-line-1 bg-bg-3 px-2 py-0.5 text-[10px] font-medium text-text-2 sm:flex">
          <ShieldCheck className="size-3 text-accent" />
          local demo frame
        </span>
      </div>

      <div className="flex flex-1">
        <nav className="hidden w-48 flex-col gap-0.5 border-r border-line-0 bg-bg-1 p-3 sm:flex">
          <div className="flex items-center gap-2 px-2 pb-3 pt-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-brand-500 font-sans text-[11px] font-bold text-white">
              A
            </span>
            <span className="text-[13px] font-semibold text-text-0">Acme Corp</span>
          </div>
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item}
              className={cn(
                "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12.5px] font-medium",
                i === 0 ? "bg-bg-3 text-text-0" : "text-text-2",
              )}
            >
              {i === 0 ? <LayoutDashboard className="size-3.5" /> : <span className="size-3.5" />}
              {item}
            </div>
          ))}
          <div className="mt-auto border-t border-line-0 pt-3">
            <div className="flex h-8 items-center gap-2.5 px-2.5 text-[12.5px] text-text-3">
              <Bell className="size-3.5" />
              Alerts
            </div>
            <div className="flex h-8 items-center gap-2.5 px-2.5 text-[12.5px] text-text-3">
              <Settings className="size-3.5" />
              Settings
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold text-text-0">Good morning, Jules</h3>
              <p className="text-[12px] text-text-2">
                Here&apos;s what&apos;s happening across your workspace.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-1 bg-bg-2 text-text-2">
                <Search className="size-3.5" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-1 bg-bg-2 text-text-2">
                <Plus className="size-3.5" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-2 text-[10px] font-semibold text-text-0">
                J
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Monthly revenue", value: "$42,918", delta: "+12.4%" },
              { label: "Active users", value: "8,142", delta: "+3.1%" },
              { label: "Open bugs", value: "24", delta: "-8.0%" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-line-1 bg-bg-2 p-3">
                <p className="text-[11px] text-text-2">{s.label}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-text-0">{s.value}</p>
                <p
                  className={cn(
                    "mt-0.5 text-[11px] font-medium",
                    s.delta.startsWith("-") ? "text-accent" : "text-brand-300",
                  )}
                >
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-line-1 bg-bg-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text-0">Recent activity</p>
                <Sparkles className="size-4 text-brand-300" />
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  { name: "Maya Patel", action: "closed", issue: "#4821 payment retry" },
                  { name: "Devon Chen", action: "assigned", issue: "#4820 SSO hang" },
                  { name: "Leo Ruiz", action: "moved to in_progress", issue: "#4819 chart tooltip" },
                ].map((a) => (
                  <div key={a.issue} className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-brand-400/70" />
                    <p className="min-w-0 flex-1 truncate text-[12px] text-text-1">
                      <span className="font-medium text-text-0">{a.name}</span> {a.action}{" "}
                      <span className="font-mono text-[11px] text-text-2">{a.issue}</span>
                    </p>
                    <span className="font-mono text-[10px] text-text-3">2m</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line-1 bg-bg-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text-0">Sprint velocity</p>
                <Badge tone="lime" className="text-[10px]">
                  On track
                </Badge>
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5">
                {[34, 52, 41, 66, 58, 74, 62].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-bg-3" style={{ height: `${h}%` }}>
                    <div
                      className="h-full w-full rounded-t bg-brand-500/80"
                      style={{ opacity: 0.55 + i * 0.07 }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-text-3">
                <span>W24</span>
                <span>W25</span>
                <span>W26</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}