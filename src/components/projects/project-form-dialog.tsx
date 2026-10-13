"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast";
import { getErrorMessage, slugify } from "@/lib/utils";
import type { Project } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Give your project a name").max(255),
  slug: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[a-z0-9-]+$/.test(v), {
      message: "Letters, numbers and hyphens only",
    }),
  description: z.string().max(1000).optional(),
});

type ProjectFormValues = z.infer<typeof schema>;

export type ProjectFormSubmit = {
  name: string;
  slug?: string;
  description?: string | null;
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectFormSubmit) => Promise<void> | void;
  initial?: Project;
  submitting?: boolean;
}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        slug: initial?.slug ?? "",
        description: initial?.description ?? "",
      });
    }
  }, [open, initial, reset]);

  const name = useWatch({ control, name: "name" });
  const slug = useWatch({ control, name: "slug" });
  const autoSlug = slug === "";

  const onLocalSubmit = async (values: ProjectFormValues) => {
    try {
      await onSubmit({
        name: values.name,
        slug: autoSlug ? slugify(values.name) : values.slug || undefined,
        description: values.description?.trim() || null,
      });
      onOpenChange(false);
      toast({
        title: initial ? "Project updated" : "Project created",
        description: initial ? "Your changes were saved." : "Time to embed the widget.",
        tone: "success",
      });
    } catch (error) {
      toast({ title: "Couldn't save project", description: getErrorMessage(error), tone: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Edit project" : "Create a project"}
      description={
        initial
          ? "Update how your project looks in the workspace."
          : "Projects collect bug reports from your widget."
      }
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="project-form" loading={submitting}>
            {initial ? "Save changes" : "Create project"}
          </Button>
        </>
      }
    >
      <form
        id="project-form"
        className="space-y-4"
        onSubmit={handleSubmit(onLocalSubmit)}
        noValidate
      >
        <Field label="Project name" htmlFor="project-name" error={errors.name?.message}>
          <Input
            id="project-name"
            autoFocus
            placeholder="e.g. Customer portal"
            {...register("name")}
          />
        </Field>
        <Field
          label="Slug"
          htmlFor="project-slug"
          error={errors.slug?.message}
          hint={
            autoSlug
              ? `Will be auto-generated: “${name ? slugify(name) : "customer-portal"}”`
              : "Used in widget URLs and public endpoints."
          }
        >
          <div className="flex items-center gap-1.5 rounded-md border border-line-2 bg-bg-2 px-3 transition-all focus-within:border-brand-500 focus-within:ring-brand">
            <span className="font-mono text-[13px] text-text-2">apps/</span>
            <input
              id="project-slug"
              className="h-9 min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text-0 outline-none placeholder:text-text-3"
              placeholder="customer-portal"
              {...register("slug")}
            />
          </div>
        </Field>
        <Field label="Description" htmlFor="project-desc" error={errors.description?.message}>
          <Textarea
            id="project-desc"
            rows={3}
            placeholder="What is this project? Who owns it?"
            {...register("description")}
          />
        </Field>
      </form>
    </Dialog>
  );
}