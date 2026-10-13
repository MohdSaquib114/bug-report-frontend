import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-bg-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_-5%,rgb(124_92_255/0.16),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <header className="relative flex h-16 items-center justify-between px-6">
        <Link href="/" aria-label="BugDrop home">
          <Logo iconSize="sm" />
        </Link>
        <ThemeToggle />
      </header>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-16">
        {children}
      </div>
    </div>
  );
}