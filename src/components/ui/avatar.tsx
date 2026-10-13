"use client";

import { cn, initials, avatarTint } from "@/lib/utils";

export interface AvatarProps {
  name?: string | null;
  email?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showRing?: boolean;
}

const SIZE_CLASSES = {
  xs: "size-5 text-[8px]",
  sm: "size-6 text-[9px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
} as const;

export function Avatar({ name, email, size = "md", className, showRing }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold",
        avatarTint(name || email),
        SIZE_CLASSES[size],
        showRing && "ring-2 ring-bg-0",
        className,
      )}
      title={name || email || undefined}
      aria-hidden="true"
    >
      {initials(name, email)}
    </span>
  );
}