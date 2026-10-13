"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { DocCallout, DocCode, DocH2, DocLead, DocList, DocP } from "@/components/docs/doc";

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-0">Installation</h1>
      <DocLead>
        BugDrop ships as a single React component. Install it anywhere you already have React — one
        dependency, no build-time magic.
      </DocLead>

      <DocH2>The flow</DocH2>
      <DocP>You&apos;ll repeat these five steps once per project.</DocP>
      <DocList
        items={[
          <>Create a project in the workspace — BugDrop generates its report URL for you.</>,
          <>Copy the project URL from the project&apos;s <DocCode>Connect</DocCode> tab.</>,
          <>Install <DocCode>bug-widget-library</DocCode> in your app.</>,
          <>Write a submit handler that POSTs the report to that project URL.</>,
          <>
            Render{" "}
            <DocCode>&lt;Widget projectUrl={`{url}`} onSubmit={`{handleSubmit}`} /&gt;</DocCode> in your app.
          </>,
        ]}
      />

      <DocH2>Get your project URL</DocH2>
      <DocP>
        Open <Link href="/app/projects" className="font-medium text-brand-300 underline underline-offset-2 hover:text-brand-400">Projects</Link>,
        create one, then copy the URL from its <DocCode>Connect</DocCode> tab. It looks like this:
      </DocP>
      <CodeBlock
        className="mt-4"
        title="Project URL"
        code={`https://api.bugdrop.dev/projects/my-app/bugs`}
      />
      <DocCallout tone="info" title="Auto-generated slug">
        <p>
          The <code className="font-mono">my-app</code> segment is derived from the project name on the
          server and is immutable. The URL you embed never changes under your users&apos; feet.
        </p>
      </DocCallout>

      <DocH2>Requirements</DocH2>
      <DocList
        items={[
          <>
            <DocCode>react</DocCode> and <DocCode>react-dom</DocCode> 18 or newer (peer dependencies — you almost
            certainly already have them).
          </>,
          <>
            Any bundler that handles <DocCode>node_modules</DocCode> packages (Next.js, Vite, Create React App,
            Remix, Parcel).
          </>,
          "A place to receive reports: the BugDrop workspace, or any HTTP endpoint.",
        ]}
      />

      <DocH2>Install with npm</DocH2>
      <DocP>In your app&apos;s directory:</DocP>
      <CodeBlock className="mt-4" title="terminal" code={`npm install bug-widget-library`} />
      <DocCallout tone="info" title="Peer dependencies">
        <p>
          The library expects <code className="font-mono">react</code> and{" "}
          <code className="font-mono">react-dom</code> already in your tree. If you&apos;re starting fresh, install
          them first.
        </p>
      </DocCallout>

      <DocH2>Import the stylesheet</DocH2>
      <DocP>
        The widget brings its own CSS. Import it once — ideally in your app&apos;s entry file or root layout:
      </DocP>
      <CodeBlock className="mt-4" title="main.tsx" code={`import "bug-widget-library/style.css";`} />
      <DocCallout tone="warning" title="Don&apos;t skip this">
        <p>
          Without the stylesheet, the widget renders with unsettled layout. The package exports a single{" "}
          <code className="font-mono">style.css</code> that scopes all its styles to its own namespaces.
        </p>
      </DocCallout>

      <DocH2>Verify with a smoke test</DocH2>
      <DocP>
        Render an empty widget with a stub submit handler. You should see the floating button appear in the
        bottom-right corner.
      </DocP>
      <CodeBlock
        className="mt-4"
        title="App.tsx"
        code={`import { Widget } from "bug-widget-library";
import "bug-widget-library/style.css";

export function App() {
  return <Widget projectUrl="https://api.example.com/projects/demo/bugs" onSubmit={() => {}} />;
}`}
      />

      <DocH2>Next steps</DocH2>
      <DocList
        items={[
          <>
            Walk the <DocCode>Usage guide</DocCode> to wire a real submit handler and read the payload.
          </>,
          <>
            Tune appearance with <DocCode>uiSettings</DocCode> — position, colors, button text, and more.
          </>,
          <>
            Create a project in the workspace to get your project URL <DocCode>/projects/&lt;slug&gt;/bugs</DocCode>.
          </>,
        ]}
      />

      <div className="mt-12 rounded-lg border border-line-1 bg-bg-2 p-5 text-sm text-text-2">
        <span className="font-mono text-xs text-text-3"># dev tip</span> — in this monorepo the package is installed
        locally via <code className="font-mono text-xs">file:../bug-widget-library</code>. For real projects, always install the
        published <code className="font-mono text-xs">bug-widget-library</code> package from npm.
      </div>
    </div>
  );
}