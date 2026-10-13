"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent";
type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon-md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white shadow-sm hover:bg-brand-400 active:bg-brand-600",
  accent: "bg-accent text-text-inverse shadow-sm hover:brightness-105",
  secondary: "bg-bg-2 text-text-0 border border-line-2 hover:bg-bg-3",
  outline: "border border-line-1 text-text-0 hover:bg-bg-1 hover:border-line-2",
  ghost: "text-text-1 hover:bg-bg-3 hover:text-text-0",
  danger: "text-danger border border-danger/25 hover:bg-danger/10",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  "icon-sm": "size-8",
  "icon-md": "size-9",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, asChild, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        disabled={disabled || loading}
        data-loading={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />}
        {asChild ? <Slottable>{children}</Slottable> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button };