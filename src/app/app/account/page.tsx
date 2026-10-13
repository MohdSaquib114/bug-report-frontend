"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, KeyRound, LogOut, Shield, UserCog, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { grantPermission, listUsers } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { formatDate, getErrorMessage, timeAgo } from "@/lib/utils";
import type { User } from "@/lib/types";

const PERMISSIONS = ["bug.view", "bug.create", "bug.update", "bug.delete", "project.manage"];

export default function AccountPage() {
  const { user, status, signOut, refresh } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [granted, setGranted] = useState<Record<string, string[]>>({});
  const [openGrant, setOpenGrant] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const list = await listUsers({ limit: 100 });
      setUsers(list);
      const map: Record<string, string[]> = {};
      for (const u of list) map[u.id] = [];
      setGranted(map);
    } catch (error) {
      toast({ title: "Couldn't load users", description: getErrorMessage(error), tone: "error" });
    } finally {
      setLoadingUsers(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.role === "admin") void loadUsers();
  }, [user?.role, loadUsers]);

  const onGrant = async (target: User, permission: string) => {
    try {
      const names = await grantPermission(target.id, permission);
      setGranted((prev) => ({ ...prev, [target.id]: names }));
      toast({ title: "Permission granted", description: `${target.email} can now ${permission}.`, tone: "success" });
    } catch (error) {
      toast({ title: "Couldn't grant permission", description: getErrorMessage(error), tone: "error" });
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <PageHeader title="Account" description="Your profile, session and access." />

      {status === "loading" ? (
        <Skeleton className="mt-6 h-40 rounded-lg" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mt-6 rounded-lg border border-line-1 bg-bg-2 p-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={user?.full_name} email={user?.email} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-text-0">{user?.full_name || user?.email}</p>
                {isAdmin && (
                  <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-300">
                    <BadgeCheck className="size-3" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-2">{user?.email}</p>
              <p className="mt-1 text-xs text-text-3">Member since {formatDate(user?.created_at)}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                void signOut().then(() => {
                  router.push("/login");
                });
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </motion.div>
      )}

      {/* Session card */}
      <div className="mt-4 rounded-lg border border-line-1 bg-bg-2 p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-text-2" />
          <p className="text-[13px] font-semibold text-text-0">Session</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge className="border-accent/20 bg-accent/10 text-accent">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />
            Authorized
          </Badge>
          <span className="text-xs text-text-3">Token valid for up to 30 days. Signing out revokes it immediately.</span>
        </div>
      </div>

      {/* Admin: user management */}
      {isAdmin && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
          className="mt-10"
        >
          <div className="flex items-center gap-2">
            <UserCog className="size-4 text-brand-400" />
            <h2 className="text-[15px] font-semibold text-text-0">User management</h2>
            <span className="font-mono text-xs tabular-nums text-text-3">{users.length}</span>
          </div>
          <p className="mt-1 text-[13px] text-text-2">
            Administrators can inspect accounts and grant global permissions.
          </p>

          <div className="mt-4">
            {loadingUsers ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-line-0 overflow-hidden rounded-lg border border-line-1 bg-bg-2">
                {users.map((u) => (
                  <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <Avatar name={u.full_name} email={u.email} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-0">
                        {u.full_name || u.email}
                        {u.id === user?.id && <span className="ml-2 text-xs font-normal text-text-3">(you)</span>}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs text-text-2">{u.email}</span>
                        <span className="text-[11px] text-text-3">· {timeAgo(u.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {u.role === "admin" ? (
                        <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-300">
                          <Shield className="size-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="border-line-1 bg-bg-3 text-text-1">User</Badge>
                      )}
                      {granted[u.id]?.map((perm) => (
                        <Badge key={perm} className="border-line-1 bg-bg-3 text-text-2 font-mono text-[10px]">
                          {perm}
                        </Badge>
                      ))}
                      {!u.is_active && <Badge className="border-line-1 bg-bg-3 text-text-3">Inactive</Badge>}
                    </div>
                    {openGrant === u.id ? (
                      <div className="flex w-full flex-wrap items-center gap-2 border-t border-line-0 pt-2 sm:w-auto sm:border-0 sm:pt-0">
                        <span className="text-[11px] uppercase tracking-wider text-text-3">Grant:</span>
                        {PERMISSIONS.map((perm) => (
                          <Button
                            key={perm}
                            size="sm"
                            variant="secondary"
                            className="h-7 px-2 font-mono text-[11px]"
                            onClick={() => void onGrant(u, perm)}
                          >
                            {perm}
                          </Button>
                        ))}
                        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setOpenGrant(null)}>
                          Done
                        </Button>
                      </div>
                    ) : user?.role === "admin" && u.role !== "admin" ? (
                      <Button size="sm" variant="ghost" onClick={() => setOpenGrant(u.id)}>
                        <Users className="size-3.5" />
                        Permissions
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.section>
      )}

      <div className="mt-10 flex items-center justify-between">
        <p className="text-xs text-text-3">Need more access? Ask an admin on your workspace.</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            void refresh();
            toast({ title: "Reloaded", description: "Profile data refreshed." });
          }}
        >
          Refresh profile
        </Button>
      </div>
    </div>
  );
}