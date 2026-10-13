"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "./utils";

type ToastTone = "success" | "error" | "info" | "loading";

interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  dismissable: boolean;
}

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  dismissable?: boolean;
}

interface ToastContextValue {
  toast: (toast: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 className="size-4 text-accent" />,
  error: <AlertCircle className="size-4 text-danger" />,
  info: <Info className="size-4 text-info" />,
  loading: <Loader2 className="size-4 text-brand-400 animate-spin" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (next: ToastInput) => {
      const id = ++idRef.current;
      const item: Toast = {
        id,
        title: next.title,
        description: next.description,
        tone: next.tone ?? "info",
        dismissable: next.dismissable ?? true,
      };
      setToasts((prev) => [...prev, item].slice(-4));
      if (item.tone !== "error" && item.tone !== "loading") {
        window.setTimeout(() => dismiss(id), 4200);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border border-line-2 bg-bg-3 p-3.5 shadow-lg",
              )}
              role="alert"
            >
              <span className="mt-0.5 shrink-0">{TONE_ICON[t.tone]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-text-0">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-[13px] leading-snug text-text-2">{t.description}</p>
                ) : null}
              </div>
              {t.dismissable && (
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded p-1 text-text-2 transition-colors hover:bg-bg-hover hover:text-text-0"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}