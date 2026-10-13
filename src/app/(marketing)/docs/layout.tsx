import type { Metadata } from "next";
import { DocsLayout } from "@/components/layout/docs-layout";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Everything you need to install, embed and configure BugDrop.",
};

export default function DocsRoute({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}