"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { register as registerUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/lib/toast";

const schema = z
  .object({
    fullName: z.string().optional(),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        full_name: values.fullName?.trim() || null,
      });
      // Now sign in automatically to enter the workspace.
      await signIn(values.email, values.password);
      toast({
        title: "Account created",
        description: "Let's set up your first project.",
        tone: "success",
      });
      router.push("/app");
      router.refresh();
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="rounded-xl border border-line-2 bg-bg-1/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-[17px] font-semibold tracking-tight text-text-0">Create your account</h1>
        <p className="mt-1 text-[13px] text-text-2">Free forever while it&apos;s early.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && (
            <div role="alert" className="rounded-md border border-danger/25 bg-danger/10 px-3 py-2.5 text-[13px] text-danger">
              {errors.root.message}
            </div>
          )}
          <Field label="Full name" htmlFor="fullName" hint="Optional — shown to teammates">
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Ada Lovelace"
              {...register("fullName")}
            />
          </Field>
          <Field label="Work email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" htmlFor="password" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Min 8 chars"
                {...register("password")}
              />
            </Field>
            <Field label="Confirm" htmlFor="confirm" error={errors.confirm?.message}>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat it"
                {...register("confirm")}
              />
            </Field>
          </div>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-text-2">
        Already have an account?{" "}
        <Link href="/login" className="inline-flex items-center gap-1 font-medium text-brand-400 transition-colors hover:text-brand-300">
          Sign in
          <ArrowRight className="size-3" />
        </Link>
      </p>
    </motion.div>
  );
}