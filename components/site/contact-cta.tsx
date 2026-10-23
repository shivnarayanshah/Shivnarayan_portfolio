import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { MagneticButton } from "@/components/ui/magnetic-button";
import type { SiteConfigDTO } from "@/lib/types";

export function ContactCTA({ config }: { config: SiteConfigDTO }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface/40 px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
          <div
            aria-hidden
            className="orb left-[8%] top-0 h-64 w-64 bg-[color-mix(in_srgb,var(--accent)_26%,transparent)]"
          />
          <div
            aria-hidden
            className="orb bottom-0 right-[10%] h-72 w-72 bg-[color-mix(in_srgb,var(--sage)_22%,transparent)]"
          />

          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {config.availability}
          </p>

          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.5rem,1.9rem+3.2vw,4.8rem)] leading-[0.96] tracking-[-0.03em] text-ink">
            Have something worth
            <br />
            <span className="italic text-gradient">building well?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-[0.95rem]">
            I&apos;m open to full-time roles and select freelance projects. Tell
            me what you&apos;re working on — I&apos;ll reply personally.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Link href="/contact" className="btn-primary">
                Start a conversation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <a
              href={`mailto:${config.email}`}
              className="btn-secondary"
            >
              <Mail className="h-4 w-4" />
              {config.email}
            </a>
          </div>

          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            {config.location} · Usually replies within a day
          </p>
        </div>
      </div>
    </section>
  );
}
