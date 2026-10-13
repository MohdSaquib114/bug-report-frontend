"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Package, Plug, Rocket } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { API_URL } from "@/lib/api";
import type { Project } from "@/lib/types";

export function ConnectPanel({ project }: { project: Project }) {
  const projectUrl = `${API_URL}/projects/${project.slug}/bugs`;

  const installCode = `npm install bug-widget-library

# then import the stylesheet once, e.g. in your entry file
import "bug-widget-library/style.css";`;

  const handlerCode = `import { Widget } from "bug-widget-library";
import type { BugReportData } from "bug-widget-library";
import "bug-widget-library/style.css";

const projectUrl = "${projectUrl}";

// Screenshots come in as PNG data URLs. Downscale and re-encode them so we
// upload small image files instead of base64 inside a JSON body.
async function toFile(dataUrl: string, name: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
  const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  return new File([blob!], name, { type: "image/jpeg" });
}

export function App() {
  const handleSubmit = async (data: BugReportData) => {
    let response: Response;

    if (data.screenshots.length > 0) {
      // Screenshots present: multipart/form-data with compressed image files.
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("timestamp", data.timestamp);
      form.append("meta", JSON.stringify(data.meta));
      for (let i = 0; i < data.screenshots.length; i++) {
        const shot = data.screenshots[i];
        form.append("screenshots", await toFile(shot.dataUrl, "screenshot-" + (i + 1) + ".jpg"));
      }
      response = await fetch(projectUrl, { method: "POST", body: form });
    } else {
      // No screenshots: a plain JSON body is enough.
      response = await fetch(projectUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) throw new Error("Failed to submit bug report");
  };

  return <Widget projectUrl={projectUrl} onSubmit={handleSubmit} />;
}`;

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-[15px] font-semibold text-text-0">Connect your app</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-text-2">
          Four steps from an empty project to live reports. Copy each value as you go.
        </p>
      </div>

      <Step index={1} icon={Plug} title="Copy your project URL">
        <p className="text-[13px] leading-relaxed text-text-2">
          Every report the widget sends is a <span className="font-mono text-text-1">POST</span> to this URL.
          The slug is generated for you and stays stable.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-md border border-line-2 bg-bg-1 px-3 py-2 font-mono text-xs text-text-1">
            {projectUrl}
          </code>
          <CopyButton value={projectUrl} label="Copy URL" ariaLabel="Copy project URL" />
        </div>
        <Link
          href={`/demo?project=${project.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Try it against this project in the live demo
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Step>

      <Step index={2} icon={Package} title="Install the widget">
        <p className="text-[13px] leading-relaxed text-text-2">
          Add the package to the app you want to collect reports from.
        </p>
        <CodeBlock className="mt-3" title="terminal" code={installCode} />
      </Step>

      <Step index={3} icon={Code2} title="Create the submit handler">
        <p className="text-[13px] leading-relaxed text-text-2">
          The widget hands you a <span className="font-mono text-text-1">BugReportData</span> payload. If it has
          screenshots, compress them and post{" "}
          <span className="font-mono text-text-1">multipart/form-data</span>; otherwise a plain{" "}
          <span className="font-mono text-text-1">JSON</span> body is enough. Either way it lands on the same
          project URL.
        </p>
        <CodeBlock className="mt-3" title="App.tsx" code={handlerCode} />
      </Step>

      <Step index={4} icon={Rocket} title="Render the widget">
        <p className="text-[13px] leading-relaxed text-text-2">
          Drop <span className="font-mono text-text-1">&lt;Widget /&gt;</span> anywhere in your app. It floats
          over the page and, on submit, calls your handler above. New reports appear on this project&apos;s
          board under <span className="font-medium text-text-0">Open</span>.
        </p>
      </Step>
    </div>
  );
}

function Step({
  index,
  icon: Icon,
  title,
  children,
}: {
  index: number;
  icon: typeof Plug;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line-1 bg-bg-2 p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 font-mono text-[12px] font-semibold text-brand-300">
          {index}
        </span>
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-text-2" />
          <p className="text-[13.5px] font-semibold text-text-0">{title}</p>
        </div>
      </div>
      <div className="mt-3 pl-11">{children}</div>
    </div>
  );
}
