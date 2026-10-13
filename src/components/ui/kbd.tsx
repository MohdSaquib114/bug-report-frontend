"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Kbd = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-1 bg-bg-3 px-1.5 font-mono text-[11px] font-medium text-text-1",
        className,
      )}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";

export { Kbd };