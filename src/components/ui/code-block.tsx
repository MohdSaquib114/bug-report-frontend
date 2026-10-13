"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  title,
  className,
  language = "tsx",
  compact = false,
}: {
  code: string;
  title?: string;
  className?: string;
  language?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line-2 bg-bg-1 shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line-0 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-text-2">
          <Terminal className="size-3.5 text-brand-400" />
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-text-2 transition-colors hover:bg-bg-hover hover:text-text-0"
        >
          {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "code-scrollbar overflow-x-auto px-4 font-mono text-[13px] leading-relaxed text-text-1",
          compact ? "py-3" : "py-4",
        )}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}