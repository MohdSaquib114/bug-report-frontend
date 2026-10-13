import type { BugPriority, BugStatus, ProjectRole } from "./types";

export type StatusMeta = {
  key: BugStatus;
  label: string;
  dotClass: string;
  chipClass: string;
  columnTitle: string;
  columnHint: string;
};

export const BUG_STATUSES: StatusMeta[] = [
  {
    key: "open",
    label: "Open",
    columnTitle: "Open",
    columnHint: "Newly reported, waiting",
    dotClass: "bg-text-1",
    chipClass: "bg-bg-2 text-text-1 border border-line-1",
  },
  {
    key: "in_progress",
    label: "In progress",
    columnTitle: "In progress",
    columnHint: "Assigned and being worked on",
    dotClass: "bg-info animate-pulse-dot",
    chipClass: "bg-info/10 text-info border border-info/20",
  },
  {
    key: "resolved",
    label: "Resolved",
    columnTitle: "Resolved",
    columnHint: "Fixed and verified",
    dotClass: "bg-accent",
    chipClass: "bg-accent/10 text-accent border border-accent/20",
  },
  {
    key: "closed",
    label: "Closed",
    columnTitle: "Closed",
    columnHint: "No longer active",
    dotClass: "bg-text-3",
    chipClass: "bg-bg-2 text-text-2 border border-line-1",
  },
];

export const bugStatusMeta = (status: BugStatus): StatusMeta =>
  BUG_STATUSES.find((s) => s.key === status) ?? BUG_STATUSES[0];

export type PriorityMeta = {
  key: BugPriority;
  label: string;
  chipClass: string;
  signalIcon: "low" | "flag" | "high" | "critical";
};

export const BUG_PRIORITIES: PriorityMeta[] = [
  {
    key: "low",
    label: "Low",
    chipClass: "bg-bg-2 text-text-2 border border-line-1",
    signalIcon: "low",
  },
  {
    key: "medium",
    label: "Medium",
    chipClass: "bg-info/10 text-info border border-info/20",
    signalIcon: "flag",
  },
  {
    key: "high",
    label: "High",
    chipClass: "bg-warning/10 text-warning border border-warning/20",
    signalIcon: "high",
  },
  {
    key: "critical",
    label: "Critical",
    chipClass: "bg-danger/10 text-danger border border-danger/25",
    signalIcon: "critical",
  },
];

export const bugPriorityMeta = (priority: BugPriority): PriorityMeta =>
  BUG_PRIORITIES.find((p) => p.key === priority) ?? BUG_PRIORITIES[1];

export type RoleMeta = {
  key: ProjectRole;
  label: string;
  description: string;
  chipClass: string;
};

export const PROJECT_ROLES: RoleMeta[] = [
  {
    key: "owner",
    label: "Owner",
    description: "Full control, incl. members & settings",
    chipClass: "bg-brand-500/10 text-brand-300 border border-brand-500/25",
  },
  {
    key: "maintainer",
    label: "Maintainer",
    description: "Manage bugs, comments and members",
    chipClass: "bg-info/10 text-info border border-info/20",
  },
  {
    key: "contributor",
    label: "Contributor",
    description: "Create and update bugs",
    chipClass: "bg-accent/10 text-accent border border-accent/20",
  },
  {
    key: "viewer",
    label: "Viewer",
    description: "Read-only access",
    chipClass: "bg-bg-2 text-text-1 border border-line-1",
  },
];

export const projectRoleMeta = (role: ProjectRole): RoleMeta =>
  PROJECT_ROLES.find((r) => r.key === role) ?? PROJECT_ROLES[2];

export const NONSERIALIZABLE_ROLE_KEYS: ProjectRole[] = ["owner"];