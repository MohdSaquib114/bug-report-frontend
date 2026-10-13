import type { Metadata } from "next";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "BugDrop",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-0">
      <MarketingNavbar />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}