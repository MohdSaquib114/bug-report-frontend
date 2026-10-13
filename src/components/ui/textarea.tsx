"use client";

import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-md border border-line-2 bg-bg-2 px-3 py-2.5 text-sm text-text-0 transition-all duration-150",
      "placeholder:text-text-2 focus:border-brand-500 focus:outline-none focus:ring-brand",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium leading-none text-text-1"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-2">{hint}</p>
      ) : null}
    </div>
  );
}

export { Textarea, Field };