import { buildReportFormData } from "./images";
import { isClient } from "./utils";
import type {
  Bug,
  BugDetail,
  BugPriority,
  BugReportData,
  BugStatus,
  Comment,
  Project,
  ProjectMember,
  ProjectRole,
  Token,
  User,
  Bug as BugType,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "bugdrop.token";

export function getStoredToken(): string | null {
  if (!isClient()) return null;
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  if (isClient()) window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (isClient()) window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, headers, auth = true }: RequestOptions = {},
): Promise<T> {
  const h: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  if (auth) {
    const token = getStoredToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      const detail = data?.detail;
      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0];
        message = first?.msg ? `${first.msg}` : message;
      }
    } catch {
      /* keep default message */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Users / auth                                                        */
/* ------------------------------------------------------------------ */

export function register(data: { email: string; password: string; full_name?: string | null }) {
  return apiFetch<User>("/users/register", { method: "POST", body: data, auth: false });
}

export function login(data: { email: string; password: string }) {
  return apiFetch<Token>("/users/login", { method: "POST", body: data, auth: false });
}

export function logout() {
  return apiFetch<void>("/users/logout", { method: "POST" });
}

export function getMe() {
  return apiFetch<User>("/users/me");
}

export function listUsers(params: { offset?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.offset !== undefined) query.set("offset", String(params.offset));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  return apiFetch<User[]>(`/users?${query.toString()}`);
}

export function grantPermission(userId: number, permission: string) {
  return apiFetch<string[]>(
    `/users/${userId}/permissions?permission=${encodeURIComponent(permission)}`,
    { method: "POST" },
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export function createProject(data: { name: string; description?: string | null }) {
  return apiFetch<Project>("/projects", { method: "POST", body: data });
}

export function listProjects(params: { include_archived?: boolean } = {}) {
  const query = new URLSearchParams();
  if (params.include_archived) query.set("include_archived", "true");
  return apiFetch<Project[]>(`/projects?${query.toString()}`);
}

export function getProject(slug: string) {
  return apiFetch<Project>(`/projects/${slug}`);
}

export function updateProject(
  slug: string,
  data: { name?: string; description?: string | null; is_archived?: boolean },
) {
  return apiFetch<Project>(`/projects/${slug}`, { method: "PATCH", body: data });
}

export function archiveProject(slug: string) {
  return apiFetch<Project>(`/projects/${slug}`, { method: "DELETE" });
}

export function listProjectMembers(slug: string) {
  return apiFetch<ProjectMember[]>(`/projects/${slug}/members`);
}

export function addProjectMember(slug: string, data: { email: string; role: ProjectRole }) {
  return apiFetch<ProjectMember>(`/projects/${slug}/members`, { method: "POST", body: data });
}

export function updateProjectMember(slug: string, userId: number, role: ProjectRole) {
  return apiFetch<ProjectMember>(`/projects/${slug}/members/${userId}`, {
    method: "PATCH",
    body: { role },
  });
}

export function removeProjectMember(slug: string, userId: number) {
  return apiFetch<void>(`/projects/${slug}/members/${userId}`, { method: "DELETE" });
}

/* ------------------------------------------------------------------ */
/* Bugs                                                                */
/* ------------------------------------------------------------------ */

export type ListBugsParams = {
  status?: BugStatus;
  priority?: BugPriority;
  assignee_id?: number;
  reporter_id?: number;
  offset?: number;
  limit?: number;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  return query.toString();
}

export function listBugs(slug: string, params: ListBugsParams = {}) {
  const query = buildQuery({ ...params, limit: params.limit ?? 100 });
  return apiFetch<BugType[]>(`/projects/${slug}/bugs?${query}`);
}

export function getBug(bugId: number) {
  return apiFetch<BugDetail>(`/bugs/${bugId}`);
}

export function updateBug(bugId: number, data: Partial<BugUpdatePayload>) {
  return apiFetch<Bug>(`/bugs/${bugId}`, { method: "PATCH", body: data });
}

export interface BugUpdatePayload {
  title?: string;
  description?: string | null;
  status?: BugStatus;
  priority?: BugPriority;
  assignee_id?: number | null;
  resolved_at?: string | null;
}

export function deleteBug(bugId: number) {
  return apiFetch<void>(`/bugs/${bugId}`, { method: "DELETE" });
}

/**
 * The backend has a single public bug-creation endpoint used by the widget.
 * Dashboard "compose" flows reuse the exact same payload shape.
 */
export function reportBug(slug: string, data: BugReportData) {
  return apiFetch<Bug>(`/projects/${slug}/bugs`, { method: "POST", body: data, auth: true });
}

/**
 * Upload a widget report as multipart/form-data. Screenshots are compressed
 * client-side and sent as image files instead of base64 inside JSON.
 */
export async function reportBugUpload(slug: string, data: BugReportData) {
  const form = await buildReportFormData(data);

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/projects/${slug}/bugs`, {
    method: "POST",
    headers,
    body: form,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      /* keep default message */
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as Bug;
}

/** Text-only reports go as JSON; reports with screenshots upload as files. */
export function submitReport(slug: string, data: BugReportData) {
  return data.screenshots.length > 0 ? reportBugUpload(slug, data) : reportBug(slug, data);
}

export function listComments(bugId: number) {
  return apiFetch<Comment[]>(`/bugs/${bugId}/comments`);
}

export function addComment(bugId: number, body: string) {
  return apiFetch<Comment>(`/bugs/${bugId}/comments`, { method: "POST", body: { body } });
}

export function listAttachments(bugId: number) {
  return apiFetch<{ id: number; filename: string | null; url: string }[]>(`/bugs/${bugId}/attachments`);
}