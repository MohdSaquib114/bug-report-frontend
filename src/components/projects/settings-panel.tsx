"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { updateProject, archiveProject } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { getErrorMessage, slugify } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().refine((v) => !v || /^[a-z0-9-]+$/.test(v), {
    message: "Letters, numbers and hyphens only",
  }),
  description: z.string().max(1000).optional(),
});

export function SettingsPanel({ project, canManage }: { project: Project; canManage: boolean }) {
  const { toast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project.name,
      slug: project.slug,
      description: project.description ?? "",
    },
  });

  const onSave = async (values: z.infer<typeof schema>) => {
    setSaving(true);
    try {
      const updated = await updateProject(project.slug, {
        name: values.name,
        description: values.description?.trim() || null,
        slug: values.slug || slugify(values.name),
      });
      toast({ title: "Project updated", description: "Changes saved.", tone: "success" });
      if (updated.slug !== project.slug) {
        router.push(`/app/projects/${updated.slug}`);
      }
      router.refresh();
    } catch (error) {
      toast({ title: "Couldn't save", description: getErrorMessage(error), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const onArchive = async () => {
    setArchiving(true);
    try {
      await archiveProject(project.slug);
      toast({ title: "Project archived", description: "Data is retained; you can restore from projects.", tone: "success" });
      router.push("/app/projects");
    } catch (error) {
      toast({ title: "Couldn't archive", description: getErrorMessage(error), tone: "error" });
    } finally {
      setArchiving(false);
    }
  };

  if (!canManage) {
    return (
      <p className="rounded-lg border border-line-1 bg-bg-2 p-6 text-sm text-text-2">
        You need maintainer or owner access to edit this project&apos;s settings.
      </p>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleSubmit(onSave)} className="space-y-4 rounded-lg border border-line-1 bg-bg-2 p-5" noValidate>
        <div>
          <p className="text-[15px] font-semibold text-text-0">General</p>
          <p className="mt-0.5 text-[13px] text-text-2">These details appear on cards, embeds and docs.</p>
        </div>
        <Field label="Project name" htmlFor="settings-name" error={errors.name?.message}>
          <Input id="settings-name" {...register("name")} />
        </Field>
        <Field
          label="Slug"
          htmlFor="settings-slug"
          error={errors.slug?.message}
          hint="Changing the slug changes the widget's report URL."
        >
          <div className="flex items-center gap-1.5 rounded-md border border-line-2 bg-bg-2 px-3 transition-all focus-within:border-brand-500 focus-within:ring-brand">
            <span className="font-mono text-[13px] text-text-2">apps/</span>
            <input
              id="settings-slug"
              className="h-9 min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text-0 outline-none"
              {...register("slug")}
            />
          </div>
        </Field>
        <Field label="Description" htmlFor="settings-desc">
          <Textarea id="settings-desc" rows={3} {...register("description")} />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>

      <div className="rounded-lg border border-danger/20 bg-danger/[0.03] p-5">
        <div className="flex items-center gap-2">
          <Archive className="size-4 text-danger" />
          <p className="text-[15px] font-semibold text-text-0">Archive project</p>
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-text-2">
          Archiving keeps all bugs and members but removes the project from your active boards.
          This is reversible from the Projects page.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-danger/25 text-danger hover:bg-danger/10"
          onClick={() => setConfirmArchive(true)}
        >
          <Trash2 className="size-4" />
          Archive project
        </Button>
      </div>

      <Dialog
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        title="Archive this project?"
        description={`“${project.name}” will be hidden from active boards. Bugs are kept.`}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setConfirmArchive(false)}>
              Keep it
            </Button>
            <Button variant="danger" loading={archiving} onClick={() => void onArchive()}>
              Archive project
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-text-2">
          The embed endpoint <span className="font-mono text-xs text-text-1">/projects/{project.slug}/bugs</span> will
          stop accepting new reports until you un-archive.
        </p>
      </Dialog>
    </div>
  );
}