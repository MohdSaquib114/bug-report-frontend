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
import { useToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/utils";
import type { Project } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Give your project a name").max(255),
  description: z.string().max(1000).optional(),
});

type ProjectFormValues = z.infer<typeof schema>;

export type ProjectFormSubmit = {
  name: string;
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
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
      });
    }
  }, [open, initial, reset]);

  const onLocalSubmit = async (values: ProjectFormValues) => {
    try {
      await onSubmit({
        name: values.name,
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
          : "Name it — BugDrop generates its report URL automatically."
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