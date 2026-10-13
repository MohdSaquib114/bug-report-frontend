"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { reportBug, updateBug } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/utils";
import { BUG_PRIORITIES } from "@/lib/constants";
import type { BugPriority } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title your report").max(500),
  description: z.string().min(1, "Give the issue some context"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

type FormValues = z.infer<typeof schema>;

export function BugComposeDialog({
  open,
  onOpenChange,
  slug,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", priority: "medium" },
  });

  useEffect(() => {
    if (open) reset({ title: "", description: "", priority: "medium" });
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const created = await reportBug(slug, {
        projectUrl: `${window.location.origin}/app/projects/${slug}`,
        title: values.title,
        description: values.description,
        screenshots: [],
        timestamp: new Date().toISOString(),
        meta: {
          url: typeof window !== "undefined" ? window.location.href : "",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          screenSize: {
            width: typeof window !== "undefined" ? window.innerWidth : 0,
            height: typeof window !== "undefined" ? window.innerHeight : 0,
          },
        },
      });
      if (values.priority !== "medium") {
        await updateBug(created.id, { priority: values.priority as BugPriority });
      }
      onOpenChange(false);
      toast({ title: "Bug reported", description: "It landed on the board.", tone: "success" });
      onCreated();
    } catch (error) {
      toast({ title: "Couldn't create bug", description: getErrorMessage(error), tone: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Report a bug"
      description="The same payload your widget sends — just from the workspace."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="bug-compose-form" loading={isSubmitting}>
            Report bug
          </Button>
        </>
      }
    >
      <form id="bug-compose-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Title" htmlFor="bug-title" error={errors.title?.message}>
          <Input
            id="bug-title"
            autoFocus
            placeholder="What's going wrong?"
            {...register("title")}
          />
        </Field>
        <Field label="Description" htmlFor="bug-desc" error={errors.description?.message}>
          <Textarea
            id="bug-desc"
            rows={4}
            placeholder="Steps to reproduce, expected vs actual, environment details…"
            {...register("description")}
          />
        </Field>
        <Field label="Priority" htmlFor="bug-priority">
          <Select id="bug-priority" {...register("priority")}>
            {BUG_PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
      </form>
    </Dialog>
  );
}