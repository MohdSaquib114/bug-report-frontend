"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Book,
  Boxes,
  CircleUserRound,
  Droplets,
  LayoutGrid,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown";

const NAV_ITEMS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/app", label: "Overview", icon: LayoutGrid },
  { href: "/app/projects", label: "Projects", icon: Boxes },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-bg-0">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line-0 bg-bg-1">
        <div className="flex h-14 shrink-0 items-center border-b border-line-0 px-4">
          <Link href="/app" aria-label="BugDrop dashboard">
            <Logo iconSize="sm" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            Workspace
          </p>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-100",
                    isActive
                      ? "text-text-0"
                      : "text-text-1 hover:bg-bg-2 hover:text-text-0",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute -left-3 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand-500"
                      transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <p className="px-2 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-text-2">
            Resources
          </p>
          <div className="flex flex-col gap-0.5">
            <NavLink
              href="/docs"
              active={pathname.startsWith("/docs")}
              icon={<Book className="size-4" />}
              label="Documentation"
            />
            <NavLink
              href="/demo"
              active={pathname.startsWith("/demo")}
              icon={<Droplets className="size-4" />}
              label="Live demo"
            />
          </div>
        </nav>

        <div className="border-t border-line-0 p-3">
          <UserMenu />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-line-0 px-6">
          <Link
            href="/"
            className="hidden text-[13px] font-medium text-text-2 transition-colors hover:text-text-0 sm:block"
          >
            Back to site
          </Link>
          <ThemeToggle />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-100",
        active ? "text-text-0" : "text-text-1 hover:bg-bg-2 hover:text-text-0",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  if (!user) return null;

  return (
    <Dropdown align="end">
      <DropdownTrigger asChild className="w-full rounded-md hover:bg-bg-2">
        <div className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5">
          <Avatar name={user.full_name} email={user.email} />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-medium leading-tight text-text-0">
              {user.full_name || user.email}
            </span>
            <span className="block truncate text-xs leading-tight text-text-2">
              {user.role === "admin" ? "Admin · " : ""}
              {user.email}
            </span>
          </span>
        </div>
      </DropdownTrigger>
      <DropdownMenu className="min-w-[230px]">
        <DropdownLabel>Account</DropdownLabel>
        <DropdownItem href="/app/account" icon={<CircleUserRound />}>
          Profile & settings
        </DropdownItem>
        <DropdownItem href="/app/projects" icon={<Boxes />}>
          Projects
        </DropdownItem>
        <DropdownItem href="/demo" icon={<Droplets />}>
          Live demo
        </DropdownItem>
        <DropdownItem href="/docs" icon={<Book />}>
          Documentation
        </DropdownItem>
        <div className="mt-1 border-t border-line-0 pt-1">
          <DropdownItem
            destructive
            icon={<LogOut />}
            onClick={() => {
              void signOut();
              router.push("/login");
            }}
          >
            Sign out
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}