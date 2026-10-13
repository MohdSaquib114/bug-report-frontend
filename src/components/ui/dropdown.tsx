"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Align = "start" | "end";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  align: Align;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown components must be used within <Dropdown>");
  return ctx;
}

export function Dropdown({
  children,
  align = "start",
  defaultOpen = false,
}: {
  children: ReactNode;
  align?: Align;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, align }}>
      <div ref={rootRef} className="relative inline-flex">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  asChild,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen, triggerRef } = useDropdown();
  return (
    <button
      ref={triggerRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      className={cn("inline-flex select-none items-center", className)}
      {...props}
    >
      {asChild ? <span className="contents">{children}</span> : children}
    </button>
  );
}

export function DropdownMenu({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, setOpen, triggerRef, align } = useDropdown();
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null);

  const measure = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const rect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const pad = 6;
    let top = rect.bottom + pad;
    if (top + menuRect.height > window.innerHeight - pad) {
      top = Math.max(pad, rect.top - menuRect.height - pad);
    }
    const right = align === "end" ? window.innerWidth - rect.right : undefined;
    setPos({ top, right: right ?? rect.left });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [align, open]);

  useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => measure());
      window.addEventListener("resize", measure);
      return () => {
        window.cancelAnimationFrame(id);
        window.removeEventListener("resize", measure);
      };
    }
  }, [open, measure]);

  return (
    <AnimatePresence>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[90] min-w-[200px]"
            style={pos ? (align === "end" ? { top: pos.top, right: pos.right } : { top: pos.top, left: pos.right }) : undefined}
          >
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              role="menu"
              onClick={() => setOpen(false)}
              className={cn(
                "flex max-h-[320px] flex-col overflow-y-auto overflow-x-hidden rounded-md border border-line-2 bg-bg-3 p-1.5 shadow-lg",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>,
          document.body,
        )}
    </AnimatePresence>
  );
}

export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  destructive?: boolean;
  icon?: ReactNode;
  href?: string;
};

export function DropdownItem({ className, destructive, icon, href, children, ...props }: DropdownItemProps) {
  const classes = cn(
    "flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-[13px] font-medium text-text-1 transition-colors duration-100",
    "hover:bg-bg-hover hover:text-text-0",
    destructive && "text-danger hover:bg-danger/10 hover:text-danger",
    className,
  );
  if (href) {
    return (
      <a href={href} role="menuitem" className={classes}>
        {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      className={classes}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">
      {children}
    </p>
  );
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div role="separator" className={cn("my-1.5 h-px bg-line-0", className)} />;
}