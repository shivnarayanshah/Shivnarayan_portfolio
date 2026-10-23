import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function SiteNotFound() {
  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden px-5 py-32 sm:px-8">
      <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
      <div
        aria-hidden
        className="orb -right-20 top-24 h-80 w-80 bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]"
      />
      <div className="mx-auto w-full max-w-[84rem] lg:px-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">
          404 — Page not found
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,2rem+5vw,6rem)] leading-[0.92] tracking-[-0.035em] text-ink">
          This page took
          <br />
          <span className="italic text-gradient">a wrong turn.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
          The link may be old, the project may have moved, or the page never
          existed. The work is still worth a look.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Link href="/projects" className="btn-secondary">
            Browse projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
