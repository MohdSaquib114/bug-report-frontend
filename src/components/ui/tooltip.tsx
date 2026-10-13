"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

export function Tooltip({
  label,
  children,
  side = "top",
  className,
  triggerClassName,
}: {
  label: ReactNode;
  children: ReactNode;
  side?: Side;
  className?: string;
  triggerClassName?: string;
}) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<CSSProperties>({});

  useEffect(() => setMounted(true), []);

  const measure = () => {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;
    const a = trigger.getBoundingClientRect();
    const b = tip.getBoundingClientRect();
    const gap = 6;
    const style: CSSProperties = {};
    if (side === "top") {
      style.top = a.top - b.height - gap;
      style.left = a.left + a.width / 2 - b.width / 2;
    } else if (side === "bottom") {
      style.top = a.bottom + gap;
      style.left = a.left + a.width / 2 - b.width / 2;
    } else if (side === "left") {
      style.top = a.top + a.height / 2 - b.height / 2;
      style.left = a.left - b.width - gap;
    } else {
      style.top = a.top + a.height / 2 - b.height / 2;
      style.left = a.right + gap;
    }
    const pad = 8;
    style.left = Math.max(pad, Math.min((style.left as number) || 0, window.innerWidth - b.width - pad));
    style.top = Math.max(pad, (style.top as number) || 0);
    setPos(style);
  };

  useEffect(() => {
    if (!show) return;
    const raf = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, label]);

  let delayTimer: ReturnType<typeof setTimeout>;
  const open = () => {
    delayTimer = setTimeout(() => setShow(true), 350);
  };
  const close = () => {
    clearTimeout(delayTimer);
    setShow(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex", triggerClassName)}
        onPointerEnter={open}
        onPointerLeave={close}
        onFocus={open}
        onBlur={close}
      >
        {children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {show && (
              <motion.div
                ref={tipRef}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  "pointer-events-none fixed z-[95] rounded-md border border-line-2 bg-bg-0 px-2.5 py-1.5 text-xs font-medium text-text-0 shadow-lg",
                  className,
                )}
                style={pos}
              >
                {label}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}