"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Braces, Bug, GripVertical, Rocket, Users } from "lucide-react";
import { DocLead } from "@/components/docs/doc";

const CARDS = [
  {
    href: "/docs/installation",
    icon: Rocket,
    title: "Installation",
    body: "Add bug-widget-library to any React app in under a minute.",
    cta: "Get started",
  },
  {
    href: "/docs/usage",
    icon: Bug,
    title: "Usage guide",
    body: "Embed the widget, wire the submit handler, and read the payload shape.",
    cta: "Read it",
  },
  {
    href: "/docs/library-api",
    icon: Braces,
    title: "Library API",
    body: "Every prop, uiSetting and event callback, with defaults.",
    cta: "Open reference",
  },
  {
    href: "/docs/live-feed",
    icon: Boxes,
    title: "Backend API",
    body: "Projects, members, bugs and comments — the endpoints under the hood.",
    cta: "Explore",
  },
];

export default function DocsOverview() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-text-0">Documentation</h1>
        <DocLead>
          BugDrop is two pieces: an <strong className="font-medium text-text-0">embeddable widget</strong> you drop into
          your React app, and a <strong className="font-medium text-text-0">workspace</strong> where the reports land.
          These docs cover both.
        </DocLead>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-xl border border-line-1 bg-bg-2 p-6 transition-all duration-200 hover:border-line-2 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-bg-3 text-text-1 transition-colors group-hover:bg-brand-500/15 group-hover:text-brand-300">
                <card.icon className="size-5" />
              </span>
              <p className="mt-4 text-[15px] font-semibold text-text-0">{card.title}</p>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-2">{card.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-400">
                {card.cta}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-line-1 bg-bg-2 p-6">
        <p className="text-[15px] font-semibold text-text-0">Recipes & concepts</p>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            { icon: GripVertical, text: "Drag-and-drop status updates" },
            { icon: Users, text: "Roles: owner, maintainer, contributor, viewer" },
            { icon: Boxes, text: "Projects, slugs and archived projects" },
            { icon: Bug, text: "The BugReportData payload shape" },
          ].map((r) => (
            <li key={r.text} className="flex items-center gap-2.5 text-sm text-text-1">
              <r.icon className="size-4 text-text-2" />
              {r.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}