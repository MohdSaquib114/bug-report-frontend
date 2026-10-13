"use client";

import { DocCallout, DocH2, DocLead, DocList } from "@/components/docs/doc";

function Endpoint({
  method,
  path,
  description,
  auth = true,
}: {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  auth?: boolean;
}) {
  const methodClass = {
    GET: "text-info",
    POST: "text-accent",
    PATCH: "text-warning",
    DELETE: "text-danger",
  }[method];
  return (
    <li className="rounded-lg border border-line-1 bg-bg-2 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`w-14 shrink-0 font-mono text-[12px] font-bold ${methodClass}`}>{method}</span>
        <code className="flex-1 font-mono text-[12.5px] text-text-0">{path}</code>
        {!auth && (
          <span className="rounded-full border border-line-1 bg-bg-3 px-2 py-0.5 text-[10px] font-medium text-text-2">
            public
          </span>
        )}
      </div>
      <p className="mt-1.5 pl-16 text-[13px] leading-relaxed text-text-2">{description}</p>
    </li>
  );
}

export default function BackendApiPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-text-0">Backend API</h1>
      <DocLead>
        The workspace talks to a FastAPI service over bearer-token auth. The same endpoints power the web app you&apos;re
        using. Base URL defaults to <code className="font-mono text-sm">http://localhost:8000</code>.
      </DocLead>

      <DocCallout tone="info" title="Authentication">
        <p>
          Protected routes require <code className="font-mono">Authorization: Bearer &lt;token&gt;</code>. Get a token
          from <code className="font-mono">POST /users/login</code>; tokens are valid 30 days and can be revoked via{" "}
          <code className="font-mono">POST /users/logout</code>.
        </p>
      </DocCallout>

      <DocH2>Users & sessions</DocH2>
      <ul className="mt-3 space-y-2">
        <Endpoint method="POST" path="/users/register" description="Create an account with email, password (min 8 chars) and optional full name." auth={false} />
        <Endpoint method="POST" path="/users/login" description="Exchange credentials for a bearer token." auth={false} />
        <Endpoint method="POST" path="/users/logout" description="Revoke the current token (204)." />
        <Endpoint method="GET" path="/users/me" description="The authenticated user&apos;s profile." />
        <Endpoint method="GET" path="/users/me/permissions" description="Global permission names granted to this user." />
        <Endpoint method="GET" path="/users" description="List users (admin only)." />
      </ul>

      <DocH2>Projects</DocH2>
      <ul className="mt-3 space-y-2">
        <Endpoint method="POST" path="/projects" description="Create a project. The creator becomes the owner. The slug is auto-generated from the name." />
        <Endpoint method="GET" path="/projects" description="List projects visible to the user. ?include_archived=true to include archives." />
        <Endpoint method="GET" path="/projects/{slug}" description="Fetch one project by slug." />
        <Endpoint method="PATCH" path="/projects/{slug}" description="Rename, edit description, archive/unarchive. The slug itself is immutable." />
        <Endpoint method="DELETE" path="/projects/{slug}" description="Soft delete — archives the project, data retained." />
        <Endpoint method="GET" path="/projects/{slug}/members" description="List project members with their roles." />
        <Endpoint method="POST" path="/projects/{slug}/members" description="Invite a member by email with a role." />
        <Endpoint method="PATCH" path="/projects/{slug}/members/{user_id}" description="Change a member&apos;s role." />
        <Endpoint method="DELETE" path="/projects/{slug}/members/{user_id}" description="Remove a member (not the owner)." />
      </ul>

      <DocH2>Bugs & reports</DocH2>
      <ul className="mt-3 space-y-2">
        <Endpoint method="POST" path="/projects/{slug}/bugs" description="The widget&apos;s endpoint. Accepts a JSON BugReportData body, or multipart/form-data with screenshot image files. Auth optional." auth={false} />
        <Endpoint method="GET" path="/projects/{slug}/bugs" description="List bugs with ?status, ?priority, ?assignee_id, ?reporter_id filters." />
        <Endpoint method="GET" path="/bugs/{bug_id}" description="Bug detail, including attachments." />
        <Endpoint method="PATCH" path="/bugs/{bug_id}" description="Update status, priority, assignee, title or description." />
        <Endpoint method="DELETE" path="/bugs/{bug_id}" description="Permanently delete a bug." />
        <Endpoint method="GET" path="/bugs/{bug_id}/comments" description="Comment thread for a bug." />
        <Endpoint method="POST" path="/bugs/{bug_id}/comments" description="Add a comment." />
        <Endpoint method="GET" path="/bugs/{bug_id}/attachments" description="List attachments." />
      </ul>

      <DocH2>Statuses & priorities</DocH2>
      <DocList
        items={[
          <>
            Status: <strong className="font-mono text-xs text-text-0">open</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">in_progress</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">resolved</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">closed</strong>.
          </>,
          <>
            Priority: <strong className="font-mono text-xs text-text-0">low</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">medium</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">high</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">critical</strong>.
          </>,
          <>
            Roles: <strong className="font-mono text-xs text-text-0">owner</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">maintainer</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">contributor</strong>,{" "}
            <strong className="font-mono text-xs text-text-0">viewer</strong>.
          </>,
        ]}
      />
    </div>
  );
}