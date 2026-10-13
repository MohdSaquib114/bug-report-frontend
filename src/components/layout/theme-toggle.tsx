"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bugdrop.theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light") document.documentElement.classList.add("light");
    setReady(true);
  }, []);

  if (!ready) return <>{children}</>;
  return <>{children}</>;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    window.localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-text-2 transition-colors",
        "hover:bg-bg-3 hover:text-text-0 focus-visible:outline-none focus-visible:ring-brand",
        className,
      )}
    >
      {light ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}