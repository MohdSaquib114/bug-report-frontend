"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Live demo" },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const { user, status } = useAuth();
  const signingIn = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b border-line-0 bg-bg-0/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo href="/" iconSize="sm" />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "text-text-0"
                  : "text-text-1 hover:text-text-0",
              )}
            >
              {pathname.startsWith(link.href) && (
                <motion.span
                  layoutId="marketing-nav-active"
                  className="absolute inset-0 rounded-md bg-bg-2"
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {signingIn || user ? (
            <Button asChild variant="primary" size="sm">
              <Link href="/app">
                Open dashboard
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/register">
                  Get started
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}