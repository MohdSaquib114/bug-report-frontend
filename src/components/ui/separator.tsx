"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("h-px w-full shrink-0 bg-line-0", className)}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

export { Separator };