"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Boxes, Code2, Cpu, Play, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCS_NAV = [
  { href: "/docs", label: "Overview", icon: BookOpen },
  { href: "/docs/installation", label: "Installation", icon: Rocket },
  { href: "/docs/usage", label: "Usage guide", icon: Code2 },
  { href: "/docs/library-api", label: "Library API", icon: Cpu },
  { href: "/docs/live-feed", label: "Backend API", icon: Boxes },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <div className="flex gap-10 py-12 lg:py-16">
        <aside className="hidden w-52 shrink-0 md:block">
          <div className="sticky top-24 flex flex-col gap-0.5">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
              Documentation
            </p>
            {DOCS_NAV.map((item) => {
              const active =
                item.href === "/docs" ? pathname === "/docs" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-100",
                    active ? "text-text-0" : "text-text-1 hover:bg-bg-2 hover:text-text-0",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="docs-nav-active"
                      className="absolute inset-0 rounded-md bg-bg-2"
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                  <item.icon className="relative size-4" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
            <div className="mt-4 border-t border-line-0 pt-4">
              <Link
                href="/demo"
                className="relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-text-1 transition-colors hover:bg-bg-2 hover:text-text-0"
              >
                <Play className="size-4" />
                Live demo
              </Link>
            </div>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}