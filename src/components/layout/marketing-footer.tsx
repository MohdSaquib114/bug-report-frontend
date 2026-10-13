"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Live demo", href: "/demo" },
      { label: "Get started", href: "/register" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Usage guide", href: "/docs/usage" },
      { label: "API reference", href: "/docs/library-api" },
    ],
  },
  {
    title: "App",
    links: [
      { label: "Dashboard", href: "/app" },
      { label: "Projects", href: "/app/projects" },
      { label: "Log in", href: "/login" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo iconSize="sm" />
          <p className="max-w-xs text-sm leading-relaxed text-text-2">
            An embeddable bug reporting widget with annotated screenshot capture,
            wired to a workspace your team will actually enjoy.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <ThemeToggle />
            <span className="text-xs text-text-3">dark-first, always</span>
          </div>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
              {column.title}
            </p>
            <ul className="mt-3 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-1 transition-colors hover:text-text-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line-0">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-text-3 sm:flex-row">
          <p>© {new Date().getFullYear()} BugDrop, Inc. Crafted with intent.</p>
          <p className="font-mono">v1.0.0 · built for teams</p>
        </div>
      </div>
    </footer>
  );
}