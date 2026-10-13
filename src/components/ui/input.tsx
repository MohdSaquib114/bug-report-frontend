"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, startAdornment, endAdornment, ...props }, ref) => (
    <div className="relative flex w-full items-center">
      {startAdornment && (
        <span className="pointer-events-none absolute left-3 text-text-2 [&>svg]:size-4">
          {startAdornment}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded-md border border-line-2 bg-bg-2 px-3 text-sm text-text-0 transition-all duration-150",
          "placeholder:text-text-2 hover:border-line-2 focus:border-brand-500 focus:outline-none focus:ring-brand",
          "disabled:cursor-not-allowed disabled:opacity-50",
          startAdornment && "pl-9",
          endAdornment && "pr-9",
          className,
        )}
        {...props}
      />
      {endAdornment && (
        <span className="pointer-events-none absolute right-3 text-text-2 [&>svg]:size-4">
          {endAdornment}
        </span>
      )}
    </div>
  ),
);
Input.displayName = "Input";

export { Input };