"use client";

import { Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "size-9 rounded-[10px]" : size === "sm" ? "size-6 rounded-md" : "size-7 rounded-lg";
  const icon = size === "lg" ? "size-5" : size === "sm" ? "size-3.5" : "size-4";
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-brand-500 text-white",
        box,
        className,
      )}
    >
      <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgb(255_255_255/0.28),transparent_45%)]" />
      <Bug className={cn("relative", icon)} aria-hidden="true" />
    </span>
  );
}

export function Logo({
  className,
  iconSize,
  wordmark = true,
  href,
}: {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
  wordmark?: boolean;
  href?: string;
}) {
  const Content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={iconSize} />
      {wordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-text-0">
          Bug<span className="text-brand-400">Drop</span>
        </span>
      )}
    </span>
  );
  if (href) {
    return (
      <a href={href} aria-label="BugDrop home">
        {Content}
      </a>
    );
  }
  return Content;
}