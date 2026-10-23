import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Database,
  GraduationCap,
  Server,
  Sparkles,
} from "lucide-react";

import { ContactCTA } from "@/components/site/contact-cta";
import { ExperienceSection } from "@/components/site/experience-section";
import { ProfilePortrait } from "@/components/site/profile-portrait";
import { SectionHeading } from "@/components/site/section-heading";
import { SocialLinks } from "@/components/site/social-links";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import {
  EDUCATION,
  PRINCIPLES,
  SKILL_GROUPS,
  STATS,
  TRAINING,
} from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/site-config";

export const revalidate = 3_600;

export const metadata: Metadata = {
  title: "About",
  description:
    "ShivNarayan Sah is a full-stack developer in Kathmandu, Nepal, working across React, Next.js, Node.js, MongoDB, and production infrastructure.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — ShivNarayan Sah",
    description:
      "A full-stack developer with a product mindset, based in Kathmandu, Nepal.",
    url: "/about",
  },
};

const groupIcons = [Code2, Database, Server, Sparkles] as const;

export default async function AboutPage() {
  const config = await getSiteConfig();

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
        <div
          aria-hidden
          className="orb -left-32 top-24 h-[24rem] w-[24rem] bg-[color-mix(in_srgb,var(--sage)_18%,transparent)]"
        />
        <div className="mx-auto grid w-full max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
          <div>
            <p
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted backdrop-blur"
              data-reveal
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About me
            </p>
            <h1
              className="font-display text-[clamp(3rem,2rem+4.8vw,5.6rem)] leading-[0.93] tracking-[-0.035em] text-ink"
              data-reveal
            >
              I build for the
              <br />
              <span className="italic text-gradient">whole product.</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-[0.98rem] leading-[1.85] text-muted"
              data-reveal
              data-reveal-delay="0.08"
            >
              {config.summary}
            </p>
            <div
              className="mt-7 flex flex-wrap items-center gap-4"
              data-reveal
              data-reveal-delay="0.12"
            >
              <SocialLinks socials={config.socials} />
              <span className="hidden h-5 w-px bg-line sm:block" />
              <Link
                href="/contact"
                className="link-underline text-sm font-medium text-ink"
              >
                Let&apos;s work together
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div
              className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6"
              data-reveal
              data-reveal-delay="0.16"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl leading-none text-ink">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="scale">
            <ProfilePortrait config={config} />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div data-reveal>
              <p className="mb-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
                <span className="h-px w-7 bg-accent/60" />
                How I work
              </p>
              <h2 className="font-display text-[clamp(2.3rem,1.8rem+2.2vw,3.8rem)] leading-[0.98] tracking-[-0.025em] text-ink">
                Three things I
                <br />
                <span className="italic text-muted">keep coming back to.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                Not a manifesto — just the habits that consistently make the work
                better.
              </p>
            </div>

            <div className="space-y-4">
              {PRINCIPLES.map((principle, index) => (
                <article
                  key={principle.number}
                  data-reveal
                  data-reveal-delay={String(index * 0.06)}
                  className="grid gap-4 rounded-[1.4rem] border border-line bg-surface/30 p-6 sm:grid-cols-[auto_1fr] sm:gap-7 sm:p-7"
                >
                  <span className="font-display text-3xl italic leading-none text-accent/70">
                    {principle.number}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/25 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Toolbox"
            title={
              <>
                The tools change.
                <br />
                <span className="italic text-muted">The standards don&apos;t.</span>
              </>
            }
            description="I pick technology for the problem, but these are the tools I reach for most — and know deeply enough to debug at 2am."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {SKILL_GROUPS.map((group, index) => {
              const Icon = groupIcons[index] ?? Sparkles;
              return (
                <article
                  key={group.title}
                  data-reveal
                  data-reveal-delay={String(index * 0.05)}
                  className="group rounded-[1.5rem] border border-line bg-surface/40 p-6 transition-colors duration-500 hover:border-line-strong hover:bg-surface/70 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-ink">
                        {group.title}
                      </h3>
                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted">
                        {group.description}
                      </p>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent transition-transform duration-500 group-hover:-rotate-6">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ExperienceSection compact showExtras={false} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div data-reveal>
              <p className="mb-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
                <span className="h-px w-7 bg-accent/60" />
                Education & training
              </p>
              <h2 className="font-display text-[clamp(2.3rem,1.8rem+2.2vw,3.8rem)] leading-[0.98] tracking-[-0.025em] text-ink">
                Formal roots,
                <br />
                <span className="italic text-muted">practical growth.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                A computer engineering foundation, followed by focused,
                project-led training in the stack I use every day.
              </p>
            </div>

            <div className="space-y-4">
              {EDUCATION.map((item, index) => (
                <article
                  key={item.qualification}
                  data-reveal
                  data-reveal-delay={String(index * 0.06)}
                  className="rounded-[1.4rem] border border-line bg-surface/30 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {item.qualification}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {item.institution}
                      </p>
                    </div>
                    <Badge variant="outline">{item.period}</Badge>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {item.detail}
                  </p>
                </article>
              ))}

              {TRAINING.map((item) => (
                <article
                  key={item.title}
                  data-reveal
                  className="overflow-hidden rounded-[1.4rem] border border-line bg-surface/30"
                >
                  <div className="grid sm:grid-cols-[1fr_0.9fr]">
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-accent" />
                        <h3 className="text-sm font-semibold text-ink">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {item.provider} · {item.period}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {item.detail}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1">
                        {item.topics.slice(0, 6).map((topic) => (
                          <li key={topic} className="tag">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="/images/certificate.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative min-h-40 border-t border-line bg-surface-muted sm:border-l sm:border-t-0"
                      aria-label="View the MERN Stack Training certificate"
                    >
                      <Image
                        src="/images/certificate.png"
                        alt="MERN Stack Training certificate awarded to ShivNarayan Sah"
                        fill
                        sizes="(max-width: 640px) 100vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-medium text-black">
                          View certificate
                        </span>
                      </span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA config={config} />
    </>
  );
}
