"use client";

import { CodeBlock } from "@/components/ui/code-block";
import {
  DocCallout,
  DocCode,
  DocH2,
  DocH3,
  DocLead,
  DocList,
  DocP,
} from "@/components/docs/doc";

export default function UsagePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-0">Usage guide</h1>
      <DocLead>
        Embed the widget, decide where reports go, and read what your submit handler receives.
      </DocLead>

      <DocH2>The flow at a glance</DocH2>
      <DocP>
        Start from a project, end with a floating widget that files reports into it.
      </DocP>
      <DocList
        items={[
          <>Create a project in the workspace.</>,
          <>Copy its project URL from the <DocCode>Connect</DocCode> tab.</>,
          <>Install <DocCode>bug-widget-library</DocCode> in your app.</>,
          <>
            Create a submit handler that POSTs the payload to that URL — JSON, or{" "}
            <DocCode>multipart/form-data</DocCode> when screenshots are attached.
          </>,
          <>
            Render <DocCode>&lt;Widget projectUrl={`{url}`} onSubmit={`{handleSubmit}`} /&gt;</DocCode>.
          </>,
        ]}
      />

      <DocH2>Basic embed</DocH2>
      <DocP>
        The widget posts to a single project URL. In the BugDrop workspace that&apos;s{" "}
        <DocCode>https://api.bugdrop.dev/projects/&lt;slug&gt;/bugs</DocCode>, where the slug is generated
        for your project — copy the exact value from the <DocCode>Connect</DocCode> tab. Your submit handler
        can, of course, send the payload anywhere instead.
      </DocP>
      <CodeBlock
        className="mt-4"
        title="App.tsx"
        code={`import { Widget } from "bug-widget-library";
import type { BugReportData } from "bug-widget-library";
import "bug-widget-library/style.css";

const projectUrl = "https://api.bugdrop.dev/projects/my-app/bugs";

// Screenshots arrive as PNG data URLs — downscale and re-encode them so we
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

  return (
    <Widget
      projectUrl={projectUrl}
      onSubmit={handleSubmit}
    />
  );
}`}
      />
      <DocCallout tone="info" title="One URL, two content types">
        <p>
          The project URL accepts both. Send <DocCode>multipart/form-data</DocCode> when there are
          screenshots so the images upload as files; send <DocCode>application/json</DocCode> for
          text-only reports. The backend stores the files for you.
        </p>
      </DocCallout>
      <DocCallout title="What the user experiences" tone="tip">
        <p>
          A floating button that opens a form. They add a title and description, optionally capture up to 3
          screenshots and annotate them (arrows, boxes, freehand) with move/resize, eraser and undo/redo, then hit submit. On success they see a
          confirmation and the report is on its way to your endpoint.
        </p>
      </DocCallout>

      <DocH2>Tuning the look</DocH2>
      <DocP>Appearance and position live in <DocCode>uiSettings</DocCode>.</DocP>
      <CodeBlock
        className="mt-4"
        title="App.tsx"
        code={`<Widget
  projectUrl="https://api.bugdrop.dev/projects/my-app/bugs"
  onSubmit={handleSubmit}
  uiSettings={{
    position: "bottom-right",        // or bottom/top-left, left, right
    primaryColor: "#3B7DFF",
    buttonText: "Report a bug",
    title: "Found something broken?",
    subtitle: "Add context + a screenshot. Two minutes, max.",
    placeholderTitle: "Short summary",
    placeholderDescription: "What happened? What did you expect?",
  }}
/>`}
      />

      <DocH2>The submit payload</DocH2>
      <DocP>
        Your handler receives a single object of type <DocCode>BugReportData</DocCode>:
      </DocP>
      <CodeBlock
        className="mt-4"
        title="Submitted object"
        code={`{
  projectUrl: "https://api.bugdrop.dev/projects/my-app/bugs",
  title: "Checkout resets on Safari",
  description: "Happens on iOS 17, after selecting a shipping method…",
  screenshots: [
    {
      id: "sc-3f9a",
      dataUrl: "data:image/png;base64,iVBORw0KG…",   // PNG, already annotated
      createdAt: 1719000000000,
    },
  ],
  timestamp: "2026-10-12T09:41:00.000Z",
  meta: {
    url: "https://my-app.com/checkout",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0…)",
    screenSize: { width: 390, height: 844 },
  },
}`}
      />
      <DocCallout tone="info" title="Screenshots are optional">
        <p>
          <code className="font-mono">screenshots</code> will be an empty array when a user skips capture. Title
          and description are always required by the form.
        </p>
      </DocCallout>

      <DocH2>Controlled mode</DocH2>
      <DocH3>Opening the form programmatically</DocH3>
      <DocP>
        Pass <DocCode>isOpen</DocCode> and <DocCode>onToggle</DocCode> to drive the drawer yourself — for example to
        trigger it from a custom button or a keyboard shortcut.
      </DocP>
      <CodeBlock
        className="mt-4"
        title="App.tsx"
        code={`export function App() {
  const [open, setOpen] = useState(false);

  return (
    <Widget
      projectUrl="…"
      onSubmit={handleSubmit}
      isOpen={open}
      onToggle={setOpen}
    />
  );
}`}
      />

      <DocH2>Success and error hooks</DocH2>
      <DocP>
        <DocCode>onSuccess</DocCode> fires after your handler resolves; <DocCode>onError</DocCode> fires when it
        throws or rejects. If you throw, the form stays open and shows the error inline.
      </DocP>
      <CodeBlock
        className="mt-4"
        title="App.tsx"
        code={`<Widget
  projectUrl="…"
  onSubmit={handleSubmit}
  onSuccess={(data) => console.log("sent", data.title)}
  onError={(error) =>
    alert(\`Couldn't send report: \${error.message}\`)
  }
/>`}
      />

      <DocH2>Why a submit handler?</DocH2>
      <DocList
        items={[
          "You keep control: the widget never talks to a vendor directly without your code.",
          "You can add auth headers, attach extra context, or write to your own queue.",
          "It works offline-first and with retries — the widget only cares that you resolve or reject.",
        ]}
      />
    </div>
  );
}