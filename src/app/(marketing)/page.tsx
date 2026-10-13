"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bug,
  Camera,
  Check,
  CheckCircle2,
  GripVertical,
  Layers,
  MessageSquare,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <LogoMarquee />
      <Features />
      <HowItWorks />
      <BoardPreview />
      <CTA />
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_50%_at_50%_-10%,rgb(124_92_255/0.25),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Badge className="gap-2 border-brand-500/25 bg-brand-500/10 px-3 py-1 text-brand-300">
            <Sparkles className="size-3" />
            v1.0 — embed, report, triage
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-7 max-w-3xl text-center text-[clamp(2.6rem,6vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-0"
        >
          Bug reporting that finally
          <span className="relative whitespace-nowrap">
            {" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              ships quality
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-text-1 sm:text-lg"
        >
          Drop a widget into your app. Users report bugs with annotated screenshots.
          Your team triages them on a kanban that feels like Linear. Ship fixes, close
          loops, move on.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/register">
              Start collecting reports
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/demo">
              <Play className="size-4" />
              Try the live demo
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-8 flex max-w-sm flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-text-2"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-accent" /> 2-minute setup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-accent" /> Annotated screenshots
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="size-3.5 text-accent" /> Drag-and-drop triage
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-[radial-gradient(50%_100%_at_50%_0%,rgb(124_92_255/0.18),transparent_70%)]" />
          <div className="relative overflow-hidden rounded-xl border border-line-2 bg-bg-1 shadow-xl">
            <div className="flex items-center gap-1.5 border-b border-line-0 px-4 py-3">
              <span className="size-2.5 rounded-full bg-bg-3" />
              <span className="size-2.5 rounded-full bg-bg-3" />
              <span className="size-2.5 rounded-full bg-bg-3" />
              <span className="ml-3 flex items-center gap-2 font-mono text-xs text-text-2">
                <Bug className="size-3.5 text-brand-400" />
                app.bugdrop.dev — the widget, live
              </span>
            </div>
            <div className="bg-grid">
              <div className="p-4 sm:p-6">
                <BoardMock />
              </div>
            </div>
          </div>
          <MockWidget className="absolute -bottom-5 right-5 hidden sm:block" />
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Board mock */

function BoardMock() {
  const columns = [
    {
      title: "Open",
      items: [
        { title: "Dark mode toggle resets filters", tag: "High" },
        { title: "Avatar colors clash on light theme", tag: "Low" },
      ],
    },
    {
      title: "In progress",
      items: [
        { title: "Screenshot annotation lags on long pages", tag: "Medium" },
      ],
    },
    {
      title: "Resolved",
      items: [
        { title: "Widget overlaps mobile nav bar", tag: "Resolved" },
        { title: "Empty state on first project", tag: "Resolved" },
      ],
    },
    {
      title: "Closed",
      items: [{ title: "Duplicated report on rapid submit", tag: "Closed" }],
    },
  ];
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((column) => (
        <div key={column.title} className="w-48 shrink-0 sm:w-56">
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="size-1.5 rounded-full bg-text-2" />
            <span className="text-xs font-semibold text-text-1">{column.title}</span>
            <span className="ml-auto text-[11px] tabular-nums text-text-2">{column.items.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {column.items.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-line-1 bg-bg-2 p-3 shadow-sm"
              >
                <p className="line-clamp-2 text-[13px] leading-snug text-text-0">{item.title}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <Badge
                    className={cn(
                      "h-[18px] px-1.5 text-[10px]",
                      item.tag === "High" && "border-warning/20 bg-warning/10 text-warning",
                      item.tag === "Medium" && "border-info/20 bg-info/10 text-info",
                      item.tag === "Low" && "border-line-1 bg-bg-3 text-text-2",
                      (item.tag === "Resolved" || item.tag === "Closed") &&
                        "border-line-1 bg-bg-3 text-text-2",
                    )}
                  >
                    {item.tag}
                  </Badge>
                  <GripVertical className="size-3.5 text-text-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MockWidget({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-line-2 bg-bg-2 p-4 shadow-xl",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow-brand">
        <Bug className="size-5" />
      </div>
      <div className="h-2 w-20 rounded-full bg-bg-3" />
      <div className="h-2 w-16 rounded-full bg-bg-3" />
      <div className="mt-1 flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
        <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />
        Captured & annotated
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- Logo marquee */

function LogoMarquee() {
  const names = ["vertex", "quantic", "helix", "nimbus", "forge", "cobalt", "orbital", "pixelate"];
  return (
    <section className="border-y border-line-0 py-10">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-text-3">
          Trusted in dev workflows at
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 pr-12">
            {[...names, ...names].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-2 font-mono text-sm text-text-2"
              >
                <span className="size-1.5 rounded-sm bg-text-3" />
                {name}.dev
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Features */

const FEATURES = [
  {
    icon: Camera,
    title: "Annotated screenshots",
    body: "Users draw on live captures — arrows, boxes, freehand — before they hit send. No more 'can't reproduce' threads.",
  },
  {
    icon: GripVertical,
    title: "Kanban triage",
    body: "Drag reports across statuses. Priorities, assignees and resolve time stamps reflow instantly, without a page reload.",
  },
  {
    icon: Users,
    title: "Roles that scale",
    body: "Owner, maintainer, contributor, viewer. Invite by email, change roles in one click, keep the owner seat yours.",
  },
  {
    icon: MessageSquare,
    title: "Context attached",
    body: "Every report carries the URL, screen size and user agent. Thread comments where the fix happens.",
  },
  {
    icon: Layers,
    title: "Works in any React app",
    body: "One `<Widget>` component, a submit handler, and you're live. The library owns the UX; you own the destination.",
  },
  {
    icon: Settings2,
    title: "An API underneath",
    body: "Create projects, manage members and move bugs programmatically. Your stack calls ours — no lock-in.",
  },
];

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <Badge className="border-line-1 bg-bg-2 text-text-1">The full loop</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
          From a user&apos;s first capture to your final fix
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-2">
          BugDrop closes the feedback loop that most teams leave open. Every feature was
          built to remove a step between &ldquo;I found a bug&rdquo; and &ldquo;it&apos;s fixed&rdquo;.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-xl border border-line-1 bg-bg-2 p-6 transition-colors duration-200 hover:border-line-2"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-bg-3 text-text-1 transition-colors group-hover:bg-brand-500/15 group-hover:text-brand-300">
              <feature.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-text-0">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-2">{feature.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- How it works */

const STEPS = [
  {
    icon: Wand2,
    title: "Install the library",
    body: "One dependency in your React app. Peer dependencies are already in your tree.",
    caption: "npm i bug-widget-library",
  },
  {
    icon: Bug,
    title: "Embed the widget",
    body: "Drop <Widget> with a submit handler. Users can report, capture and annotate in seconds.",
    caption: "<Widget projectUrl=\"…\" onSubmit={…} />",
  },
  {
    icon: Users,
    title: "Triage in the workspace",
    body: "Reports land on your project's board. Drag, prioritize, assign, comment, resolve.",
    caption: "app.bugdrop.dev/projects/your-app",
  },
];

function HowItWorks() {
  return (
    <section className="relative border-t border-line-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgb(124_92_255/0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-28">
        <motion.div {...fadeUp} className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge className="border-line-1 bg-bg-2 text-text-1">Setup in minutes</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
              Three steps. Zero friction.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-2">
              You don&apos;t need a migration. BugDrop fits where your users already are — at
              the bottom-right corner of your app.
            </p>
            <div className="mt-8 flex flex-col gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300">
                      <step.icon className="size-4" />
                    </span>
                    {i < STEPS.length - 1 && <span className="mt-2 w-px flex-1 bg-line-1" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-text-0">
                      <span className="mr-2 font-mono text-xs font-normal text-text-3">{`0${i + 1}`}</span>
                      {step.title}
                    </p>
                    <p className="mt-1 max-w-sm text-sm leading-relaxed text-text-2">{step.body}</p>
                    <p className="mt-2 font-mono text-xs text-text-2">{step.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div {...fadeUp}>
            <CodeBlock title="widget.tsx" code={WIDGET_EXAMPLE} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const WIDGET_EXAMPLE = `import { Widget } from "bug-widget-library";
import "bug-widget-library/style.css";

export function App() {
  return (
    <Widget
      projectUrl="https://api.bugdrop.dev/projects/my-app/bugs"
      uiSettings={{
        position: "bottom-right",
        primaryColor: "#7C5CFF",
        buttonText: "Report a bug",
      }}
    />
  );
}`;

/* ----------------------------------------------------------- Board preview */

function BoardPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:pb-28">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <Badge className="border-line-1 bg-bg-2 text-text-1">Export-ready triage</Badge>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
          A board your team won&apos;t abandon
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-2">
          Drop a widget into your docs, demo, or staging site — then move the results where
          they belong. BugDrop treats triage as a first-class job.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-line-1 bg-bg-2 p-5"
          >
            <p className="flex items-center gap-1.5 text-xs font-medium text-text-2">
              <span className={stat.dot} />
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-text-0">
              {stat.value}
            </p>
            <p className="mt-1 text-[13px] text-text-3">{stat.meta}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const STAT_CARDS = [
  { label: "Open", dot: "size-1.5 rounded-full bg-text-1", value: "12", meta: "waiting for triage" },
  { label: "In progress", dot: "size-1.5 animate-pulse-dot rounded-full bg-info", value: "5", meta: "being worked on" },
  { label: "Resolved", dot: "size-1.5 rounded-full bg-accent", value: "48", meta: "this sprint" },
  { label: "Avg. time to close", dot: "size-1.5 rounded-full bg-text-1", value: "2.4h", meta: "from capture to fix" },
];

/* ------------------------------------------------------------------- CTA */

function CTA() {
  return (
    <section className="relative border-t border-line-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgb(124_92_255/0.16),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
        <motion.div {...fadeUp}>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-5xl">
            Ship fewer bugs. Notice the ones you do.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-text-2">
            Create a free account, spin up a project, and embed your first widget before
            your coffee cools.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">
                Get started — it&apos;s free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[13px] text-text-2">
            <Check className="size-3.5 text-accent" />
            No credit card. No email verification gate.
          </p>
        </motion.div>
      </div>
    </section>
  );
}