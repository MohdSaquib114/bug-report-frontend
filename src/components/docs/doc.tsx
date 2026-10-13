"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocLead({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-1">{children}</p>;
}

export function DocH2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-text-0">
      {children}
    </h2>
  );
}

export function DocH3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-[15px] font-semibold tracking-tight text-text-0">{children}</h3>;
}

export function DocP({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-1">{children}</p>;
}

export function DocCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-line-1 bg-bg-2 px-1.5 py-0.5 font-mono text-[12.5px] text-brand-300">
      {children}
    </code>
  );
}

export function DocList({ items }: { items: Array<string | ReactNode> }) {
  return (
    <ul className="mt-4 max-w-2xl space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text-1">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-text-3" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocCallout({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "tip";
  title?: string;
}) {
  const config = {
    info: { icon: Info, classes: "border-info/20 bg-info/[0.05] text-text-1", iconClass: "text-info" },
    warning: { icon: AlertTriangle, classes: "border-warning/25 bg-warning/[0.05] text-text-1", iconClass: "text-warning" },
    tip: { icon: Lightbulb, classes: "border-accent/20 bg-accent/[0.04] text-text-1", iconClass: "text-accent" },
  }[tone];
  const Icon = config.icon;
  return (
    <div className={cn("mt-5 flex max-w-2xl gap-3 rounded-lg border p-4", config.classes)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconClass)} />
      <div className="text-sm leading-relaxed">
        {title && <p className="mb-1 font-semibold text-text-0">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export type PropRow = {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: ReactNode;
};

export function PropTable({ rows, className }: { rows: PropRow[]; className?: string }) {
  return (
    <div className={cn("mt-5 overflow-x-auto rounded-lg border border-line-1", className)}>
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line-0 bg-bg-2">
            {["Prop", "Type", "", "Description"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
                {h === "" ? "Default" : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-0">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-medium text-brand-300">
                {row.name}
                {row.required && <span className="ml-1 text-danger">*</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-info">{row.type}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-text-2">{row.default ?? "—"}</td>
              <td className="px-4 py-3 text-[13px] leading-relaxed text-text-1">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeStep({ children }: { children: ReactNode }) {
  return <div className="mt-5">{children}</div>;
}