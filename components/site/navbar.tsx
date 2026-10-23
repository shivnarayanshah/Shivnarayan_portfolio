"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { SocialLinks } from "@/components/site/social-links";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_LINKS } from "@/lib/constants";
import type { SiteConfigDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ config }: { config: SiteConfigDTO }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        open
          ? "border-b border-line bg-[var(--surface)]"
          : scrolled
            ? "border-b border-line bg-[var(--nav)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-10">
        <Link
          href="/"
          aria-label={`${config.name} — home`}
          className="group inline-flex items-center gap-3"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-surface/70 font-display text-[0.95rem] italic leading-none text-ink shadow-sm transition-transform duration-500 group-hover:-rotate-6">
            SN
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-accent/10" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[0.8rem] font-semibold tracking-tight text-ink">
              {config.name}
            </span>
            <span className="text-[0.625rem] uppercase tracking-[0.18em] text-muted">
              {config.role}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-line bg-surface/40 px-1.5 py-1.5 backdrop-blur-md md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium transition-colors duration-300",
                  active
                    ? "text-ink"
                    : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface-strong shadow-sm ring-1 ring-line"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent px-4 py-2.5 text-[0.75rem] font-semibold leading-none text-accent-ink shadow-[0_10px_24px_-14px_var(--accent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-strong sm:inline-flex"
          >
            Let&apos;s talk
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/60 text-ink transition hover:bg-surface md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex min-h-0 flex-col overflow-y-auto border-t border-line bg-[var(--surface)] px-5 pb-10 pt-2 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={reduced ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { delay: 0.04 * index + 0.05, duration: 0.3 }
                  }
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-2xl tracking-tight text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-muted" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="max-w-[15rem] text-xs leading-relaxed text-muted">
                {config.availability}
              </p>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary shrink-0"
              >
                Start a conversation
              </Link>
            </div>

            <div className="mt-auto border-t border-line pt-6">
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                Get in touch
              </p>
              <a
                href={`mailto:${config.email}`}
                className="mt-2 block truncate font-display text-xl tracking-tight text-ink"
              >
                {config.email}
              </a>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <SocialLinks socials={config.socials} />
                <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {config.location}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
