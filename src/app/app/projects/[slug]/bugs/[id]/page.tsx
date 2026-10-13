"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  Globe,
  MessageSquare,
  MoreHorizontal,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/bugs/status-badge";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/components/bugs/priority-badge";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import {
  addComment,
  deleteBug,
  getBug,
  listComments,
  listProjectMembers,
  updateBug,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime, getErrorMessage, timeAgo } from "@/lib/utils";
import { BUG_PRIORITIES, BUG_STATUSES } from "@/lib/constants";
import type { BugDetail, BugPriority, BugStatus, Comment, ProjectMember } from "@/lib/types";

export default function BugDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const bugId = Number(id);
  const [bug, setBug] = useState<BugDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bugData, commentData, memberData] = await Promise.all([
        getBug(bugId),
        listComments(bugId),
        listProjectMembers(slug),
      ]);
      setBug(bugData);
      setComments(commentData);
      setMembers(memberData);
    } catch (error) {
      toast({ title: "Couldn't load bug", description: getErrorMessage(error), tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [bugId, slug, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (data: Partial<{ status: BugStatus; priority: BugPriority; assignee_id: number | null }>) => {
    if (!bug) return;
    setUpdating(true);
    try {
      const updated = await updateBug(bug.id, data);
      setBug({ ...bug, ...updated });
    } catch (error) {
      toast({ title: "Update failed", description: getErrorMessage(error), tone: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const onComment = async () => {
    const body = draft.trim();
    if (!body || !bug) return;
    setSending(true);
    try {
      const comment = await addComment(bug.id, body);
      setComments((prev) => [...prev, comment]);
      setDraft("");
      toast({ title: "Comment posted", tone: "success" });
    } catch (error) {
      toast({ title: "Couldn't post comment", description: getErrorMessage(error), tone: "error" });
    } finally {
      setSending(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteBug(bugId);
      toast({ title: "Bug deleted", description: `#${bugId} was removed.`, tone: "success" });
      router.push(`/app/projects/${slug}`);
    } catch (error) {
      toast({ title: "Couldn't delete", description: getErrorMessage(error), tone: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const currentRole = user
    ? members.find((m) => m.user_id === user.id)?.role
    : undefined;
  void currentRole;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-4 w-48" />
        <Skeleton className="mt-8 h-40 rounded-lg" />
        <Skeleton className="mt-4 h-24 rounded-lg" />
      </div>
    );
  }

  if (!bug) {
    return <div className="mx-auto max-w-4xl px-6 py-16 text-center text-sm text-text-2">Bug not found.</div>;
  }

  const assignee = bug.assignee_id ? members.find((m) => m.user_id === bug.assignee_id) : undefined;
  const reporter = bug.reporter_id ? members.find((m) => m.user_id === bug.reporter_id) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href={`/app/projects/${slug}`}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-2 transition-colors hover:text-text-0"
      >
        <ArrowLeft className="size-3.5" />
        Back to board
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm text-text-3">#{bug.id}</span>
            <StatusBadge status={bug.status} />
            <PriorityBadge priority={bug.priority} />
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-text-0 sm:text-2xl">{bug.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              {formatDateTime(bug.created_at)}
            </span>
            {bug.resolved_at && (
              <span className="inline-flex items-center gap-1.5 text-accent">
                <CalendarClock className="size-3.5" />
                Resolved {timeAgo(bug.resolved_at)}
              </span>
            )}
            {bug.ip_address && (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="size-3.5" />
                {bug.ip_address}
              </span>
            )}
          </div>
        </div>

        <Dropdown align="end">
          <DropdownTrigger aria-label="Bug actions" className="rounded-md p-1.5 text-text-2 transition-colors hover:bg-bg-3 hover:text-text-0">
            <MoreHorizontal className="size-4" />
          </DropdownTrigger>
          <DropdownMenu className="min-w-[220px]">
            <DropdownLabel>Danger zone</DropdownLabel>
            <DropdownItem destructive icon={<Trash2 />} onClick={() => setConfirmDelete(true)}>
              Delete bug
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* What’s happening */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="mt-6 grid gap-3 sm:grid-cols-3"
      >
        <FieldCard label="Status">
          <Dropdown align="start">
            <DropdownTrigger className="w-full">
              <span className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line-2 bg-bg-2 px-3 text-sm text-text-0 transition-colors hover:bg-bg-3">
                <StatusBadge status={bug.status} />
                <ChevronDown className="size-3.5 text-text-2" />
              </span>
            </DropdownTrigger>
            <DropdownMenu className="min-w-[190px]">
              {BUG_STATUSES.map((s) => (
                <DropdownItem key={s.key} onClick={() => patch({ status: s.key })}>
                  <StatusBadge status={s.key} />
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </FieldCard>

        <FieldCard label="Priority">
          <Dropdown align="start">
            <DropdownTrigger className="w-full">
              <span className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line-2 bg-bg-2 px-3 text-sm text-text-0 transition-colors hover:bg-bg-3">
                <PriorityBadge priority={bug.priority} />
                <ChevronDown className="size-3.5 text-text-2" />
              </span>
            </DropdownTrigger>
            <DropdownMenu className="min-w-[160px]">
              {BUG_PRIORITIES.map((p) => (
                <DropdownItem key={p.key} onClick={() => patch({ priority: p.key })}>
                  <PriorityBadge priority={p.key} />
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </FieldCard>

        <FieldCard label="Assignee">
          <Dropdown align="start">
            <DropdownTrigger className="w-full">
              <span className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-line-2 bg-bg-2 px-3 text-sm text-text-0 transition-colors hover:bg-bg-3">
                <span className="flex items-center gap-2 truncate">
                  {assignee ? (
                    <>
                      <Avatar name={assignee.user.full_name} email={assignee.user.email} size="xs" />
                      <span className="truncate">{assignee.user.full_name || assignee.user.email}</span>
                    </>
                  ) : (
                    <span className="text-text-2">Unassigned</span>
                  )}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-text-2" />
              </span>
            </DropdownTrigger>
            <DropdownMenu className="min-w-[220px]">
              <DropdownItem icon={<UserRound />} onClick={() => patch({ assignee_id: null })}>
                Unassign
              </DropdownItem>
              {members
                .filter((m) => m.role !== "viewer")
                .map((m) => (
                  <DropdownItem
                    key={m.user_id}
                    onClick={() => patch({ assignee_id: m.user_id })}
                  >
                    <Avatar name={m.user.full_name} email={m.user.email} size="xs" />
                    <span className="truncate">{m.user.full_name || m.user.email}</span>
                    <span className="ml-auto text-[10px] font-medium text-text-3">{m.role}</span>
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </FieldCard>
      </motion.div>

      {updating && <p className="mt-2 text-xs text-text-3">Saving changes…</p>}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.2, 0, 0, 1] }}
        className="mt-8 rounded-lg border border-line-1 bg-bg-2 p-5"
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-text-0">Description</p>
          <span className="text-xs text-text-3">by {reporter?.user.full_name || reporter?.user.email || "widget"}</span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-1">
          {bug.description || "No description provided."}
        </p>
      </motion.div>

      {/* Comments */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        className="mt-8"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-text-2" />
          <h2 className="text-[15px] font-semibold text-text-0">Comments</h2>
          <span className="font-mono text-xs tabular-nums text-text-3">{comments.length}</span>
        </div>

        <div className="mt-4 space-y-5">
          {comments.map((comment) => {
            const author = comment.author_id ? members.find((m) => m.user_id === comment.author_id) : undefined;
            return (
              <div key={comment.id} className="flex gap-3">
                <Avatar name={author?.user.full_name} email={author?.user.email} size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-semibold text-text-0">
                      {author?.user.full_name || author?.user.email || "BugDrop widget"}
                    </span>
                    <span className="text-xs text-text-3">{timeAgo(comment.created_at)}</span>
                    {comment.is_edited && <span className="text-[11px] text-text-3">· edited</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-1">{comment.body}</p>
                </div>
              </div>
            );
          })}
          {comments.length === 0 && (
            <p className="rounded-lg border border-dashed border-line-2 p-5 text-center text-[13px] text-text-2">
              No comments yet. Start the thread below.
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Avatar name={user?.full_name} email={user?.email} size="sm" className="mt-1" />
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void onComment();
              }}
              rows={3}
              placeholder="Add context, a fix proposal, a link… (⌘/Ctrl + Enter to send)"
              className="w-full resize-none rounded-md border border-line-2 bg-bg-2 px-3.5 py-2.5 text-sm text-text-0 outline-none transition-all placeholder:text-text-2 focus:border-brand-500 focus:ring-brand"
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={onComment} loading={sending} disabled={!draft.trim()}>
                {!sending && <Send className="size-3.5" />}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <Separator className="mt-10" />

      <Dialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this bug?"
        description={`#${bugId} — “${bug.title}”. This can't be undone.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={() => void onDelete()}>
              <Trash2 className="size-4" />
              Delete bug
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-text-2">
          The report, its comments and any attachments will be permanently removed from the project.
        </p>
      </Dialog>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-2">{label}</p>
      {children}
    </div>
  );
}