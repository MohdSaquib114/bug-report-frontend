"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="sm"
      className="w-full"
      onClick={() => {
        void signOut().then(() => {
          router.push("/login");
        });
      }}
    >
      Sign out
    </Button>
  );
}