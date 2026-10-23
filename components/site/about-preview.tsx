import Link from "next/link";
import { ArrowUpRight, Code2, Layers3, Sparkles } from "lucide-react";

import { PRINCIPLES } from "@/lib/constants";
import type { SiteConfigDTO } from "@/lib/types";

const icons = [Layers3, Code2, Sparkles] as const;

export function AboutPreview({ config }: { config: SiteConfigDTO }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <p className="mb-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
              <span className="h-px w-7 bg-accent/60" />
              About
            </p>
            <h2 className="font-display text-[clamp(2.3rem,1.8rem+2.2vw,3.8rem)] leading-[0.98] tracking-[-0.025em] text-ink">
              A developer with
              <br />
              <span className="italic text-muted">a product mindset.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-[1.85] text-muted">
              {config.summary}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/about" className="btn-secondary">
                Read the full story
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="link-underline text-sm font-medium text-ink"
              >
                Work with me
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {PRINCIPLES.map((principle, index) => {
              const Icon = icons[index] ?? Sparkles;
              return (
                <article
                  key={principle.number}
                  data-reveal
                  data-reveal-delay={String(index * 0.07)}
                  className="group relative flex gap-5 rounded-[1.4rem] border border-line bg-surface/30 p-6 transition-colors duration-500 hover:border-line-strong hover:bg-surface/60 sm:p-7"
                >
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-accent transition-transform duration-500 group-hover:-rotate-6">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[0.6rem] tabular-nums tracking-[0.16em] text-muted">
                      {principle.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </div>
                </article>
              );
            })}

            <div
              data-reveal
              className="relative overflow-hidden rounded-[1.4rem] border border-line bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_55%,color-mix(in_srgb,var(--sage)_12%,transparent))] p-6 sm:p-7"
            >
              <p className="font-display text-2xl leading-snug tracking-tight text-ink sm:text-[1.7rem]">
                “The best interface is the one nobody has to think about.”
              </p>
              <p className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                A working principle
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
