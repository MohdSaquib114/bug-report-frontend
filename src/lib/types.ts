export type UserRole = "user" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_at: string | null;
}

export type ProjectRole = "owner" | "maintainer" | "contributor" | "viewer";

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_archived: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMemberUser {
  id: number;
  email: string;
  full_name: string | null;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  role: ProjectRole;
  created_at: string;
  user: ProjectMemberUser;
}

export type BugStatus = "open" | "in_progress" | "resolved" | "closed";
export type BugPriority = "low" | "medium" | "high" | "critical";

export interface Bug {
  id: number;
  title: string;
  description: string | null;
  status: BugStatus;
  priority: BugPriority;
  project_id: number;
  reporter_id: number | null;
  assignee_id: number | null;
  ip_address: string | null;
  location: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  filename: string | null;
  url: string;
  storage_key: string | null;
  content_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

export interface BugDetail extends Bug {
  attachments: Attachment[];
}

export interface Comment {
  id: number;
  body: string;
  bug_id: number;
  author_id: number | null;
  parent_id: number | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScreenshotItem {
  id: string;
  dataUrl: string;
  createdAt: number;
}

export interface BugReportMetadata {
  url: string;
  userAgent: string;
  timestamp?: string;
  screenSize: { width: number; height: number };
}

export interface BugReportData {
  projectUrl: string;
  title: string;
  description: string;
  screenshots: ScreenshotItem[];
  timestamp: string;
  meta: BugReportMetadata;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}