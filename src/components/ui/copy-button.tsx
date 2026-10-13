"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  className,
  ariaLabel,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const icon = copied ? (
    <Check className="size-3.5 shrink-0 text-accent" />
  ) : (
    <Copy className="size-3.5 shrink-0" />
  );

  if (label === undefined) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={ariaLabel ?? "Copy"}
        title={ariaLabel ?? "Copy"}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md border border-line-2 bg-bg-3 text-text-2 transition-colors hover:bg-bg-hover hover:text-text-0",
          className,
        )}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel ?? label}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border border-line-2 bg-bg-3 px-2.5 text-[12px] font-medium text-text-1 transition-colors hover:bg-bg-hover hover:text-text-0",
        className,
      )}
    >
      {icon}
      {copied ? copiedLabel : label}
    </button>
  );
}
