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
import { useAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/lib/toast";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await signIn(values.email, values.password);
      toast({ title: "Welcome back", description: "You're signed in.", tone: "success" });
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
        <h1 className="text-[17px] font-semibold tracking-tight text-text-0">Sign in to BugDrop</h1>
        <p className="mt-1 text-[13px] text-text-2">Get back to triaging your reports.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && (
            <div role="alert" className="rounded-md border border-danger/25 bg-danger/10 px-3 py-2.5 text-[13px] text-danger">
              {errors.root.message}
            </div>
          )}
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
            />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-text-2">
        New to BugDrop?{" "}
        <Link href="/register" className="inline-flex items-center gap-1 font-medium text-brand-400 transition-colors hover:text-brand-300">
          Create an account
          <ArrowRight className="size-3" />
        </Link>
      </p>
    </motion.div>
  );
}