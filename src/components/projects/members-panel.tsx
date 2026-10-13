"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, MoreHorizontal, UserMinus, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import {
  addProjectMember,
  listProjectMembers,
  removeProjectMember,
  updateProjectMember,
} from "@/lib/api";
import { useToast } from "@/lib/toast";
import { getErrorMessage, cn } from "@/lib/utils";
import { PROJECT_ROLES, projectRoleMeta } from "@/lib/constants";
import type { ProjectMember, ProjectRole } from "@/lib/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "maintainer", "contributor", "viewer"]),
});

export function MembersPanel({ slug, canManage }: { slug: string; canManage: boolean }) {
  const { toast } = useToast();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "contributor" },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listProjectMembers(slug);
      setMembers(list);
    } catch (error) {
      toast({ title: "Couldn't load members", description: getErrorMessage(error), tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const onAdd = async (values: z.infer<typeof schema>) => {
    setAdding(true);
    try {
      const member = await addProjectMember(slug, values);
      setMembers((prev) => [...prev, member]);
      reset({ email: "", role: "contributor" });
      toast({
        title: "Member invited",
        description: `${member.user.email} is now a ${member.role}.`,
        tone: "success",
      });
    } catch (error) {
      toast({ title: "Couldn't add member", description: getErrorMessage(error), tone: "error" });
    } finally {
      setAdding(false);
    }
  };

  const onRoleChange = async (member: ProjectMember, role: ProjectRole) => {
    try {
      const updated = await updateProjectMember(slug, member.user_id, role);
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      toast({ title: "Role updated", description: `${member.user.email} is now a ${role}.` });
    } catch (error) {
      toast({ title: "Couldn't update role", description: getErrorMessage(error), tone: "error" });
    }
  };

  const onRemove = async (member: ProjectMember) => {
    try {
      await removeProjectMember(slug, member.user_id);
      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      toast({ title: "Member removed", description: `${member.user.email} was removed from the project.` });
    } catch (error) {
      toast({ title: "Couldn't remove member", description: getErrorMessage(error), tone: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {canManage && (
        <form
          onSubmit={handleSubmit(onAdd)}
          noValidate
          className="rounded-lg border border-line-1 bg-bg-2 p-4"
        >
          <p className="text-[13px] font-semibold text-text-0">Invite by email</p>
          <p className="mt-0.5 text-[13px] text-text-2">
            Members can be added by their account email. Roles take effect immediately.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-2">
                <Mail className="size-4" />
              </span>
              <Input
                type="email"
                placeholder="teammate@company.com"
                className="pl-9"
                aria-label="Email address"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>
            <Select className="sm:w-40" {...register("role")} aria-label="Role">
              {PROJECT_ROLES.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </Select>
            <Button type="submit" loading={adding} className="shrink-0">
              Invite
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No members yet"
          description="Invite teammates to share triage duty. The owner seat is always yours."
        />
      ) : (
        <ul className="divide-y divide-line-0 rounded-lg border border-line-1 bg-bg-2">
          {members.map((member) => {
            const role = projectRoleMeta(member.role);
            const selectable = member.role !== "owner";
            return (
              <li key={member.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={member.user.full_name} email={member.user.email} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-0">
                    {member.user.full_name || member.user.email}
                  </p>
                  <p className="truncate text-xs text-text-2">{member.user.email}</p>
                </div>
                <Badge className={cn("hidden sm:inline-flex", role.chipClass)}>{role.label}</Badge>

                {canManage && selectable ? (
                  <Dropdown align="end">
                    <DropdownTrigger aria-label={`Options for ${member.user.email}`} className="rounded-md p-1.5 text-text-2 transition-colors hover:bg-bg-hover hover:text-text-0">
                      <MoreHorizontal className="size-4" />
                    </DropdownTrigger>
                    <DropdownMenu className="min-w-[220px]">
                      <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
                        Change role
                      </p>
                      {PROJECT_ROLES.filter((r) => r.key !== "owner").map((r) => (
                        <DropdownItem key={r.key} onClick={() => onRoleChange(member, r.key)}>
                          <span className="flex flex-col items-start">
                            <span>{r.label}</span>
                            <span className="text-[11px] font-normal text-text-2">{r.description}</span>
                          </span>
                        </DropdownItem>
                      ))}
                      <div className="mt-1 border-t border-line-0 pt-1">
                        <DropdownItem destructive icon={<UserMinus />} onClick={() => onRemove(member)}>
                          Remove member
                        </DropdownItem>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                ) : (
                  <Badge className={cn("sm:hidden", role.chipClass)}>{role.label}</Badge>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}