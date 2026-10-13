"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  createPortal,
} from "react-dom";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hideClose?: boolean;
}

export function Dialog({ open, onOpenChange, title, description, children, footer, className, hideClose }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-line-2 bg-bg-2 shadow-xl",
              className,
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-start justify-between gap-6 border-b border-line-0 px-5 py-4">
                <div>
                  {title && (
                    <h2 className="text-[15px] font-semibold tracking-tight text-text-0">{title}</h2>
                  )}
                  {description && (
                    <p className="mt-0.5 text-[13px] text-text-2">{description}</p>
                  )}
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    aria-label="Close dialog"
                    onClick={() => onOpenChange(false)}
                    className="-mr-1.5 rounded-md p-1.5 text-text-2 transition-colors hover:bg-bg-hover hover:text-text-0"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-line-0 px-5 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}