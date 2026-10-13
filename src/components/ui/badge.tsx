"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "brand" | "lime" | "danger" | "warning" | "info";

export const BADGE_TONES: Record<
  BadgeTone,
  { classes: string; dot: string }
> = {
  neutral: { classes: "border-line-1 bg-bg-2 text-text-1", dot: "bg-text-1" },
  brand: { classes: "border-brand-500/30 bg-brand-500/10 text-brand-300", dot: "bg-brand-400" },
  lime: { classes: "border-accent/30 bg-accent/10 text-accent", dot: "bg-accent" },
  danger: { classes: "border-danger/30 bg-danger/10 text-danger", dot: "bg-danger" },
  warning: { classes: "border-warning/30 bg-warning/10 text-warning", dot: "bg-warning" },
  info: { classes: "border-info/30 bg-info/10 text-info", dot: "bg-info" },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  dotClass?: string;
  icon?: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = "neutral", dot, dotClass, icon, children, ...props }, ref) => {
    const toneStyles = BADGE_TONES[tone];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
          toneStyles.classes,
          className,
        )}
        {...props}
      >
        {dot ? (
          <span className={cn("size-[6px] shrink-0 rounded-full", toneStyles.dot, dotClass)} />
        ) : null}
        {icon && <span className="shrink-0 [&>svg]:size-3">{icon}</span>}
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

export { Badge };