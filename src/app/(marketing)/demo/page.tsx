"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  Camera,
  Check,
  Cloud,
  CloudOff,
  LayoutDashboard,
  MousePointerClick,
  Palette,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
} from "lucide-react";
import { API_URL, submitReport } from "@/lib/api";
import { cn, getErrorMessage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { useToast } from "@/lib/toast";
import type { BugReportData, WidgetButtonSize, WidgetPosition } from "bug-widget-library";

const Widget = dynamic(() => import("bug-widget-library").then((m) => m.Widget), { ssr: false });

type FeedItem = BugReportData & { id: string; receivedAt: number; persisted: boolean };

interface WidgetConfig {
  position: WidgetPosition;
  primaryColor: string;
  buttonSize: WidgetButtonSize;
  buttonText: string;
  title: string;
  subtitle: string;
}

const DEFAULT_CONFIG: WidgetConfig = {
  position: "bottom-right",
  primaryColor: "#3B7DFF",
  buttonSize: "md",
  buttonText: "Report a bug",
  title: "Found something broken?",
  subtitle: "Tell us what happened. Screenshots are optional — but they help a lot.",
};

const ACCENTS: { name: string; value: string }[] = [
  { name: "Cobalt", value: "#3B7DFF" },
  { name: "Blue", value: "#2563EB" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Ink", value: "#0F172A" },
];

const POSITIONS: { value: WidgetPosition; label: string; dot: string }[] = [
  { value: "top-left", label: "Top left", dot: "top-0.5 left-0.5" },
  { value: "top-right", label: "Top right", dot: "top-0.5 right-0.5" },
  { value: "left", label: "Middle left", dot: "left-0.5 top-1/2 -translate-y-1/2" },
  { value: "right", label: "Middle right", dot: "right-0.5 top-1/2 -translate-y-1/2" },
  { value: "bottom-left", label: "Bottom left", dot: "bottom-0.5 left-0.5" },
  { value: "bottom-right", label: "Bottom right", dot: "bottom-0.5 right-0.5" },
];

const SIZES: { value: WidgetButtonSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
];

const NAV_ITEMS = ["Overview", "Analytics", "Customers", "Projects", "Reports"];

export default function DemoPage() {
  const { toast } = useToast();
  const [slug, setSlug] = useState("demo");
  const [slugDraft, setSlugDraft] = useState("demo");
  const [targetOpen, setTargetOpen] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_CONFIG);

  const projectUrl = `${API_URL}/projects/${slug}/bugs`;

  const update = useCallback(
    <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) =>
      setConfig((c) => ({ ...c, [key]: value })),
    [],
  );

  const handleSubmit = useCallback(
    async (data: BugReportData) => {
      try {
        await submitReport(slug, {
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
        description: `Couldn't reach ${API_URL}. The widget still works — the report just won't persist.`,
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

  const embedCode = useMemo(
    () => `import { Widget } from "bug-widget-library";
import type { BugReportData } from "bug-widget-library";
import "bug-widget-library/style.css";

const projectUrl = "${projectUrl}";

// Screenshots arrive as PNG data URLs — downscale and re-encode them so we
// upload small image files instead of base64 inside a JSON body.
async function toFile(dataUrl: string, name: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  return new File([blob!], name, { type: "image/jpeg" });
}

export function App() {
  const handleSubmit = async (data: BugReportData) => {
    let response: Response;

    if (data.screenshots.length > 0) {
      // Screenshots present: send a multipart file upload.
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("timestamp", data.timestamp);
      form.append("meta", JSON.stringify(data.meta));
      for (let i = 0; i < data.screenshots.length; i++) {
        const shot = data.screenshots[i];
        form.append("screenshots", await toFile(shot.dataUrl, "screenshot-" + (i + 1) + ".jpg"));
      }
      response = await fetch(projectUrl, { method: "POST", body: form });
    } else {
      // No screenshots: a plain JSON body is enough.
      response = await fetch(projectUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) throw new Error("Failed to submit bug report");
  };

  return (
    <Widget
      projectUrl={projectUrl}
      onSubmit={handleSubmit}
      uiSettings={{
        position: "${config.position}",
        primaryColor: "${config.primaryColor}",
        buttonSize: "${config.buttonSize}",${
          config.buttonText ? `\n        buttonText: "${config.buttonText}",` : ""
        }
        title: "${config.title}",
      }}
    />
  );
}`,
    [projectUrl, config],
  );

  const statusTone = online === null ? "neutral" : online ? "accent" : "danger";

  return (
    <div className="min-h-screen">
      <div className="border-b border-line-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-text-0">Live demo</h1>
                <Badge tone={statusTone} dot={online === true} className="ml-1">
                  {online === null ? "Connecting…" : online ? "Backend online" : "Backend offline"}
                </Badge>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm text-text-2">
                This is the real <code className="font-mono text-xs">bug-widget-library</code> widget running on
                this page. Try it, restyle it, and watch the reports land in the feed.
              </p>
            </div>
            <button
              onClick={() => setTargetOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-md border border-line-2 bg-bg-2 px-3 text-[13px] font-medium text-text-1 transition-colors hover:bg-bg-3 hover:text-text-0"
            >
              <Settings className="size-4" />
              Target board
              <Badge tone="accent" className="text-[10px]">
                {slug}
              </Badge>
            </button>
          </div>

          <AnimatePresence>
            {targetOpen && (
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
                    <span className="text-xs text-text-2">projects/</span>
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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-1 bg-bg-2 p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <MousePointerClick className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-text-0">Try the widget</p>
                  <p className="text-xs text-text-2">
                    It floats on the page — open it, file a bug, or tweak its look.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWidgetOpen(true)}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-brand-500 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-400"
                >
                  <Sparkles className="size-4" />
                  Open the widget
                </button>
                <button
                  onClick={() => setConfig(DEFAULT_CONFIG)}
                  className="flex h-9 items-center gap-1.5 rounded-md border border-line-2 bg-bg-3 px-3 text-[13px] font-medium text-text-1 transition-colors hover:bg-bg-hover hover:text-text-0"
                >
                  <RotateCcw className="size-3.5" />
                  Reset look
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-line-1 shadow-lg">
              <MockApp onOpenWidget={() => setWidgetOpen(true)} />
            </div>

            <AppearancePanel config={config} update={update} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-5">
              <ReportFeed
                feed={feed}
                online={online}
                onClear={() => setFeed([])}
              />
              <HowItWorks onOpenWidget={() => setWidgetOpen(true)} />
            </div>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CodeBlock title="App.tsx" code={embedCode} />
          <p className="text-xs leading-relaxed text-text-3">
            Copy this into any React app. The handler receives a{" "}
            <code className="font-mono text-text-2">BugReportData</code> payload — title, description,
            annotated screenshots, timestamp and page metadata. Post it anywhere.
          </p>
        </div>
      </div>

      <Widget
        projectUrl={projectUrl}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        isOpen={widgetOpen}
        onToggle={setWidgetOpen}
        uiSettings={{
          position: config.position,
          primaryColor: config.primaryColor,
          buttonSize: config.buttonSize,
          buttonText: config.buttonText,
          title: config.title,
          subtitle: config.subtitle,
          placeholderTitle: "Short summary",
          placeholderDescription: "What did you expect, and what actually happened?",
        }}
      />
    </div>
  );
}

function AppearancePanel({
  config,
  update,
}: {
  config: WidgetConfig;
  update: <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) => void;
}) {
  return (
    <div className="rounded-xl border border-line-1 bg-bg-2 p-5">
      <div className="flex items-center gap-2">
        <Palette className="size-4 text-brand-300" />
        <p className="text-[13px] font-semibold text-text-0">Appearance</p>
        <span className="text-xs text-text-3">updates the live widget instantly</span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-text-1">Position</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {POSITIONS.map((p) => {
              const selected = config.position === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  title={p.label}
                  aria-label={p.label}
                  aria-pressed={selected}
                  onClick={() => update("position", p.value)}
                  className={cn(
                    "relative h-12 rounded-lg border transition-colors",
                    selected
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-line-2 bg-bg-3 hover:border-line-2 hover:bg-bg-hover",
                  )}
                >
                  <span
                    className={cn(
                      "absolute size-2 rounded-full",
                      selected ? "bg-brand-400" : "bg-text-3",
                      p.dot,
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-text-1">Accent color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACCENTS.map((a) => {
              const selected = config.primaryColor === a.value;
              return (
                <button
                  key={a.value}
                  type="button"
                  title={a.name}
                  aria-label={`${a.name} accent`}
                  aria-pressed={selected}
                  onClick={() => update("primaryColor", a.value)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-bg-2 transition",
                    selected ? "ring-2 ring-text-0" : "ring-1 ring-line-2 hover:scale-110",
                  )}
                  style={{ backgroundColor: a.value }}
                >
                  {selected && <Check className="size-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-text-1">Button size</p>
              <div className="mt-2 inline-flex rounded-lg border border-line-2 bg-bg-3 p-0.5">
                {SIZES.map((s) => {
                  const selected = config.buttonSize === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update("buttonSize", s.value)}
                      className={cn(
                        "size-7 rounded-md text-xs font-semibold transition-colors",
                        selected
                          ? "bg-brand-500 text-white"
                          : "text-text-2 hover:text-text-0",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-medium text-text-1">Button label</span>
          <input
            value={config.buttonText}
            onChange={(e) => update("buttonText", e.target.value)}
            placeholder="Report a bug"
            className="mt-2 h-9 w-full rounded-md border border-line-2 bg-bg-3 px-3 text-[13px] text-text-0 outline-none transition-all focus:border-brand-500 focus:ring-brand"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-text-1">Widget title</span>
          <input
            value={config.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Found something broken?"
            className="mt-2 h-9 w-full rounded-md border border-line-2 bg-bg-3 px-3 text-[13px] text-text-0 outline-none transition-all focus:border-brand-500 focus:ring-brand"
          />
        </label>
      </div>
    </div>
  );
}

function ReportFeed({
  feed,
  online,
  onClear,
}: {
  feed: FeedItem[];
  online: boolean | null;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line-1 bg-bg-2 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-brand-300" />
          <p className="text-[13px] font-semibold text-text-0">Live report feed</p>
          {feed.length > 0 && (
            <span className="rounded-full bg-bg-3 px-1.5 py-px font-mono text-[10px] text-text-2">
              {feed.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {online === true && <Cloud className="size-4 text-accent" />}
          {online === false && <CloudOff className="size-4 text-warning" />}
          {feed.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear feed"
              className="text-text-3 transition-colors hover:text-text-1"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {feed.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Terminal className="size-6 text-text-3" />
          <p className="text-[13px] text-text-2">No reports yet.</p>
          <p className="max-w-[15rem] text-xs leading-relaxed text-text-3">
            Open the floating widget, file a bug, then submit — it appears here instantly.
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
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[10px] uppercase tracking-wide text-text-3">
                      {item.meta.url.replace(/^https?:\/\//, "").slice(0, 26) || "local"}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {item.screenshots.length > 0 && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-2">
                          <Camera className="size-3" />
                          {item.screenshots.length}
                        </span>
                      )}
                      <span
                        className={cn(
                          "font-mono text-[10px]",
                          item.persisted ? "text-accent" : "text-warning",
                        )}
                      >
                        {item.persisted ? "on board" : "local"}
                      </span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function HowItWorks({ onOpenWidget }: { onOpenWidget: () => void }) {
  const steps = [
    {
      icon: MousePointerClick,
      title: "Open the widget",
      body: "Click the floating button wherever it sits on the page.",
    },
    {
      icon: Camera,
      title: "Describe & annotate",
      body: "Add a title, details, and optionally capture a screenshot to annotate with arrows, boxes, freehand, and an eraser.",
    },
    {
      icon: Send,
      title: "Submit",
      body: "The report posts to your project and shows up in the live feed.",
    },
  ];

  return (
    <div className="rounded-xl border border-line-1 bg-bg-2 p-4">
      <p className="text-[13px] font-semibold text-text-0">How it works</p>
      <ol className="mt-3 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-bg-3 text-[11px] font-semibold text-text-2">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-text-0">
                <step.icon className="size-3.5 text-brand-300" />
                {step.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onOpenWidget}
        className="mt-4 w-full rounded-md border border-line-2 bg-bg-3 py-2 text-[12.5px] font-medium text-text-1 transition-colors hover:bg-bg-hover hover:text-text-0"
      >
        Launch the widget
      </button>
    </div>
  );
}

function MockApp({ onOpenWidget }: { onOpenWidget: () => void }) {
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
                <Badge tone="accent" className="text-[10px]">
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-line-2 bg-bg-2 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                <MousePointerClick className="size-4" />
              </span>
              <p className="text-[12.5px] text-text-1">
                Spot something off in this dashboard?{" "}
                <span className="text-text-2">File it right from here.</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenWidget}
              className="flex h-8 items-center gap-1.5 rounded-md border border-line-2 bg-bg-3 px-3 text-[12px] font-medium text-text-0 transition-colors hover:bg-bg-hover"
            >
              <Sparkles className="size-3.5 text-brand-300" />
              Open widget
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
