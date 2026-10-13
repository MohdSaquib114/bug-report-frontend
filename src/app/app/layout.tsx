"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || status === "anonymous") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-bg-0">
        <span className="size-8 animate-pulse rounded-lg bg-bg-3" />
        <Spinner className="text-text-3" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}