"use client";

import { CodeBlock } from "@/components/ui/code-block";
import {
  DocCallout,
  DocCode,
  DocH2,
  DocLead,
  DocP,
  PropTable,
  type PropRow,
} from "@/components/docs/doc";

const WIDGET_PROPS: PropRow[] = [
  {
    name: "projectUrl",
    type: "string",
    required: true,
    description: "Project report URL; included in the payload and shown in the form header.",
  },
  {
    name: "onSubmit",
    type: "(data: BugReportData) => Promise<void> | void",
    required: true,
    description:
      "Submit handler. Send the report wherever you want. Throw or reject to fail the submit.",
  },
  { name: "uiSettings", type: "WidgetUiSettings", default: "{}", description: "Appearance and placement options." },
  {
    name: "onSuccess",
    type: "(data: BugReportData) => void",
    description: "Called after onSubmit resolves successfully.",
  },
  {
    name: "onError",
    type: "(error: Error) => void",
    description: "Called when onSubmit throws or rejects.",
  },
  { name: "isOpen", type: "boolean", description: "Controlled open state for the drawer." },
  { name: "onToggle", type: "(open: boolean) => void", description: "Fired when open state changes." },
  { name: "className", type: "string", default: "''", description: "Extra class on the floating button wrapper." },
];

const UI_SETTINGS: PropRow[] = [
  {
    name: "position",
    type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'right' | 'left'",
    default: "'bottom-right'",
    description: "Button position; the form slides from the same side.",
  },
  { name: "primaryColor", type: "string", default: "'#2563eb'", description: "Accent color for button and actions." },
  { name: "buttonSize", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Floating button size." },
  { name: "buttonText", type: "string", description: "Optional label next to the icon." },
  { name: "buttonIcon", type: "ReactNode", description: "Custom trigger icon (defaults to a bug icon)." },
  { name: "title", type: "string", default: "'Report a Bug'", description: "Form header title." },
  {
    name: "subtitle",
    type: "string",
    default: "'Found an issue? …'",
    description: "Form header subtitle.",
  },
  { name: "placeholderTitle", type: "string", description: "Title input placeholder." },
  { name: "placeholderDescription", type: "string", description: "Description textarea placeholder." },
  { name: "zIndex", type: "number", default: "99990", description: "Base z-index for overlays." },
];

export default function LibraryApiPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-0">Library API</h1>
      <DocLead>
        The public surface of <DocCode>bug-widget-library</DocCode> is one component, one stylesheet, and the
        types below. Everything else is internal.
      </DocLead>

      <DocH2>Exports</DocH2>
      <CodeBlock
        className="mt-4"
        title="imports"
        code={`import { Widget } from "bug-widget-library";
import type {
  WidgetProps,
  WidgetUiSettings,
  WidgetPosition,
  WidgetButtonSize,
  BugReportData,
  BugReportMetadata,
  ScreenshotItem,
} from "bug-widget-library";
import "bug-widget-library/style.css";`}
      />

      <DocH2>&lt;Widget /&gt; props</DocH2>
      <PropTable rows={WIDGET_PROPS} />

      <DocH2>uiSettings</DocH2>
      <DocP>The second argument to <DocCode>uiSettings</DocCode>:</DocP>
      <PropTable rows={UI_SETTINGS} />

      <DocH2>BugReportData</DocH2>
      <CodeBlock
        className="mt-4"
        title="types"
        code={`interface ScreenshotItem {
  id: string;
  dataUrl: string;      // PNG data URL
  createdAt: number;
}

interface BugReportMetadata {
  url: string;          // page URL where the report was filed
  userAgent: string;
  timestamp?: string;
  screenSize: { width: number; height: number };
}

interface BugReportData {
  projectUrl: string;
  title: string;
  description: string;
  screenshots: ScreenshotItem[];   // up to 3
  timestamp: string;               // ISO string
  meta: BugReportMetadata;
}`}
      />
      <DocCallout tone="info" title="Uploading screenshots">
        <p>
          Each screenshot is a PNG <DocCode>dataUrl</DocCode>. For uploads, compress it to an image file and
          send <DocCode>multipart/form-data</DocCode> rather than embedding the base64 string in JSON — see the{" "}
          <a href="/docs/usage" className="font-medium text-brand-300 underline underline-offset-2 hover:text-brand-400">usage guide</a>.
        </p>
      </DocCallout>
      <DocCallout title="Play with the real package" tone="tip">
        <p>
          Head to the <a href="/demo" className="font-medium text-brand-300 underline underline-offset-2 hover:text-brand-400">live demo</a> to
          fire real reports through the widget and watch them land in a board.
        </p>
      </DocCallout>
    </div>
  );
}