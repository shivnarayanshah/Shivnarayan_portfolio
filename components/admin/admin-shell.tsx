"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { ADMIN_NAV } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";

const icons = {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Settings,
} as const;

function SidebarContent({
  name,
  email,
  onNavigate,
}: {
  name: string;
  email: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5 lg:h-20">
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className="inline-flex items-center gap-3"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface font-display text-sm italic text-ink">
            SN
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.8rem] font-semibold text-ink">
              Portfolio
            </span>
            <span className="text-[0.58rem] uppercase tracking-[0.18em] text-muted">
              Admin studio
            </span>
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted">
          Manage
        </p>
        {ADMIN_NAV.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons] ?? LayoutDashboard;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.8rem] font-medium transition-all duration-200",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-surface-muted/60 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
                  active
                    ? "border-accent/20 bg-accent/10 text-accent"
                    : "border-line bg-surface/50 text-muted group-hover:text-ink",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {item.label}
              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-line bg-surface/40 px-3 py-2.5 text-[0.72rem] font-medium text-ink transition-colors hover:bg-surface"
        >
          View public site
          <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
        </Link>

        <div className="flex items-center gap-3 rounded-xl bg-surface-muted/50 px-3 py-2.5">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[0.65rem] font-semibold text-ink">
            {getInitials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.72rem] font-medium text-ink">{name}</p>
            <p className="truncate text-[0.6rem] text-muted">{email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-red-500"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const current =
    ADMIN_NAV.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] border-r border-line bg-surface/35 backdrop-blur-xl lg:block">
        <SidebarContent name={user.name} email={user.email} />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={reduced ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: "-100%" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 34 }
              }
              className="fixed inset-y-0 left-0 z-50 w-[17rem] border-r border-line bg-surface shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent
                name={user.name}
                email={user.email}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-[var(--nav)] px-4 backdrop-blur-xl sm:px-6 lg:h-20 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/60 text-ink lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.18em] text-muted">
                Admin
              </p>
              <p className="text-sm font-semibold text-ink">{current}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-line bg-surface/50 px-3.5 py-2 text-[0.7rem] font-medium text-ink transition-colors hover:bg-surface sm:inline-flex"
            >
              View site
              <ArrowUpRight className="h-3 w-3 text-muted" />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
