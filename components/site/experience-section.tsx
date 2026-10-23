import Link from "next/link";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";

import { EDUCATION, EXPERIENCE, TRAINING } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function ExperienceSection({
  compact = false,
  showExtras = true,
}: {
  compact?: boolean;
  showExtras?: boolean;
}) {
  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
            <p className="mb-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
              <span className="h-px w-7 bg-accent/60" />
              Experience
            </p>
            <h2 className="font-display text-[clamp(2.3rem,1.8rem+2.2vw,3.8rem)] leading-[0.98] tracking-[-0.025em] text-ink">
              In the work,
              <br />
              <span className="italic text-muted">not just the résumé.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              I&apos;ve spent my time building and running real products — the
              kind with users, business rules, and consequences.
            </p>
            {!compact ? (
              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                More about how I work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <div className="space-y-6">
            {EXPERIENCE.map((item, index) => (
              <article
                key={`${item.company}-${item.role}`}
                data-reveal
                data-reveal-delay={String(index * 0.08)}
                className="relative overflow-hidden rounded-[1.6rem] border border-line bg-surface/40 p-6 backdrop-blur-sm sm:p-8"
              >
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/[0.08] blur-2xl"
                />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-semibold tracking-tight text-ink">
                        {item.role}
                      </h3>
                      {item.current ? (
                        <Badge variant="sage">
                          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                          Current
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-accent">{item.company}</p>
                  </div>
                  <div className="text-right text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                    <p>{item.period}</p>
                    <p className="mt-1 inline-flex items-center gap-1 normal-case tracking-normal">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-[0.83rem] leading-relaxed text-ink-soft"
                    >
                      <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {item.links?.length ? (
                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
                    {item.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-[0.72rem] font-medium text-muted"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}

            <div className="grid gap-4 sm:grid-cols-2">
              {showExtras
                ? TRAINING.map((item) => (
                    <article
                      key={item.title}
                      data-reveal
                      className="rounded-[1.4rem] border border-line bg-surface/30 p-5"
                    >
                      <GraduationCap className="h-5 w-5 text-accent" />
                      <h3 className="mt-4 text-sm font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {item.provider} · {item.period}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {item.detail}
                      </p>
                    </article>
                  ))
                : null}
              {showExtras
                ? EDUCATION.slice(0, 1).map((item) => (
                    <article
                      key={item.qualification}
                      data-reveal
                      data-reveal-delay="0.06"
                      className="rounded-[1.4rem] border border-line bg-surface/30 p-5"
                    >
                      <GraduationCap className="h-5 w-5 text-sage" />
                      <h3 className="mt-4 text-sm font-semibold text-ink">
                        {item.qualification}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {item.institution}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {item.detail}
                      </p>
                    </article>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
