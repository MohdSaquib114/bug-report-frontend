"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

export function Tabs({
  tabs,
  active,
  onActiveChange,
  className,
}: {
  tabs: TabItem[];
  active: string;
  onActiveChange: (active: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex items-center gap-1 border-b border-line-0", className)}>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onActiveChange(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors duration-150",
              selected ? "text-text-0" : "text-text-2 hover:text-text-0",
            )}
          >
            {tab.icon && <span className="[&>svg]:size-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full bg-bg-3 px-1.5 py-px text-[11px] font-medium tabular-nums",
                  selected ? "text-text-1" : "text-text-2",
                )}
              >
                {tab.count}
              </span>
            )}
            {selected && (
              <motion.span
                layoutId="tabs-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-500"
                transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}