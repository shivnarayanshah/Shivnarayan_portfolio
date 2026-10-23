import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { isSafeRedirect } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage the portfolio.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = isSafeRedirect(next, "/admin/dashboard");

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden border-r border-line bg-surface/30 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden className="hero-grid absolute inset-0 opacity-40" />
        <div
          aria-hidden
          className="orb -left-20 top-24 h-80 w-80 bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]"
        />
        <div
          aria-hidden
          className="orb bottom-10 right-0 h-72 w-72 bg-[color-mix(in_srgb,var(--sage)_18%,transparent)]"
        />

        <Link href="/" className="relative inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface font-display text-base italic">
            SN
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-ink">
              ShivNarayan Sah
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Portfolio admin
            </span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">
            The quiet back office
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,2rem+3vw,4.4rem)] leading-[0.96] tracking-[-0.03em] text-ink">
            Keep the work
            <br />
            <span className="italic text-gradient">current.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Projects, images, case studies, and site settings — all in one
            protected place. Changes go live immediately.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-[0.68rem] text-muted">
          <LockKeyhole className="h-3.5 w-3.5" />
          Authorized access only · Sessions expire automatically
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface font-display text-sm italic">
                SN
              </span>
              <span className="text-sm font-semibold text-ink">
                Portfolio admin
              </span>
            </Link>
          </div>

          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Welcome back
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink">
            Sign in.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Use the admin account configured for this portfolio.
          </p>

          <div className="mt-8">
            <LoginForm redirectTo={redirectTo} />
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-[0.7rem]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure session
            </span>
          </div>

          <p className="mt-6 text-[0.66rem] leading-relaxed text-muted">
            Need help? Contact the site owner.{" "}
            <a
              href="mailto:shivnarayan2072@gmail.com"
              className="inline-flex items-center gap-0.5 text-accent underline underline-offset-2"
            >
              Email
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
