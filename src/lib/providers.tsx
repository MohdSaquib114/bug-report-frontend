"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";
import { ThemeProvider } from "@/components/layout/theme-toggle";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}