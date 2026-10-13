"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { BugReportData } from "bug-widget-library";
import { getStoredToken } from "@/lib/api";
import { buildReportFormData } from "@/lib/images";

const Widget = dynamic(() => import("bug-widget-library").then((m) => m.Widget), {
  ssr: false,
});

/** Backend project every report is posted to. */
export const BUG_REPORT_URL =
  "https://bug-report-back-end.onrender.com/projects/example-project/bugs";

/** Matches `brand-500` in src/app/globals.css so the widget blends in. */
const PRIMARY_COLOR = "#3B7DFF";

async function postReport(data: BugReportData) {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response =
    data.screenshots.length > 0
      ? await fetch(BUG_REPORT_URL, {
          method: "POST",
          headers,
          body: await buildReportFormData(data),
        })
      : await fetch(BUG_REPORT_URL, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }
}

export function BugReportWidget() {
  const pathname = usePathname();

  // The /demo page already embeds the full configurable widget; skip the global
  // one so end users don't see two floating buttons there.
  if (pathname?.startsWith("/demo")) return null;

  return (
    <Widget
      projectUrl={BUG_REPORT_URL}
      onSubmit={postReport}
      uiSettings={{
        primaryColor: PRIMARY_COLOR,
      }}
    />
  );
}