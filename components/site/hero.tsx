"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ProfilePortrait } from "@/components/site/profile-portrait";
import { SocialLinks } from "@/components/site/social-links";
import { STATS } from "@/lib/constants";
import type { SiteConfigDTO } from "@/lib/types";

function splitTitle(title: string, accent: string) {
  if (!accent) return { before: title, accent: "" };
  const index = title.toLowerCase().indexOf(accent.toLowerCase());
  if (index < 0) return { before: title, accent: "" };
  return {
    before: title.slice(0, index).trimEnd(),
    accent: title.slice(index),
  };
}

export function Hero({ config }: { config: SiteConfigDTO }) {
  const rootRef = useRef<HTMLElement>(null);
  const { before, accent } = splitTitle(config.heroTitle, config.heroAccent);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    function revealWithoutMotion() {
      rootRef.current
        ?.querySelectorAll<HTMLElement>(
          "[data-hero-eyebrow], [data-hero-line], [data-hero-fade], [data-hero-portrait], [data-hero-stat]",
        )
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });
    }

    void (async () => {
      try {
        const { gsap } = await import("gsap");
        if (cancelled) return;

        context = gsap.context(() => {
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            delay: 0.1,
          });

          timeline
            .fromTo(
              "[data-hero-eyebrow]",
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.6 },
            )
            .fromTo(
              "[data-hero-line]",
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12 },
              "-=0.25",
            )
            .fromTo(
              "[data-hero-fade]",
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 },
              "-=0.6",
            )
            .fromTo(
              "[data-hero-portrait]",
              { opacity: 0, scale: 0.94, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 1.1 },
              "-=0.85",
            )
            .fromTo(
              "[data-hero-stat]",
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
              "-=0.55",
            );
        }, rootRef);
      } catch (error) {
        console.error("[hero] entrance animation failed", error);
        revealWithoutMotion();
      }
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      <div aria-hidden className="hero-grid absolute inset-0 -z-20" />
      <div
        aria-hidden
        className="orb -left-32 top-10 h-[26rem] w-[26rem] bg-[color-mix(in_srgb,var(--accent)_24%,transparent)]"
      />
      <div
        aria-hidden
        className="orb -right-24 top-1/3 h-[30rem] w-[30rem] bg-[color-mix(in_srgb,var(--sage)_20%,transparent)]"
      />
      <div
        aria-hidden
        className="orb bottom-0 left-1/3 h-[20rem] w-[20rem] bg-[color-mix(in_srgb,var(--gold)_16%,transparent)]"
      />

      <div className="mx-auto grid w-full max-w-[84rem] gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:px-10">
        <div className="relative z-10">
          <div
            data-hero-eyebrow
            className="mb-7 inline-flex  gap-2 items-center gap-x-3 gap-y-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
              {config.availability || "Open to new opportunities"}
            </span>
            <span className="hidden text-[0.65rem] text-muted sm:inline">
              · {config.location}
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.9rem,2rem+5.2vw,5.8rem)] leading-[0.94] tracking-[-0.035em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line className="block">
                {before}
              </span>
            </span>
            {accent ? (
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-hero-line
                  className="block italic text-gradient"
                >
                  {accent}
                </span>
              </span>
            ) : null}
          </h1>

          <p
            data-hero-fade
            className="mt-7 max-w-xl text-[0.95rem] leading-[1.8] text-muted sm:text-base"
          >
            {config.summary}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton>
              <Link href="/#work" className="btn-primary">
                View selected work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.18}>
              <a
                href={config.resumeUrl || "/shivnarayan.pdf"}
                download="ShivNarayan-Sah-Resume.pdf"
                className="btn-secondary"
              >
                <Download className="h-4 w-4" />
                Download résumé
              </a>
            </MagneticButton>
          </div>

          <div
            data-hero-fade
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <SocialLinks socials={config.socials} />
            <span className="hidden h-5 w-px bg-line sm:block" />
            <a
              href={`mailto:${config.email}`}
              className="link-underline text-[0.78rem] font-medium text-ink-soft"
            >
              {config.email}
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {STATS.map((stat) => (
              <div key={stat.label} data-hero-stat>
                <dd className="font-display text-3xl leading-none tracking-tight text-ink sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-[0.62rem] uppercase leading-relaxed tracking-[0.12em] text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:pl-6">
          <ProfilePortrait config={config} />
        </div>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8 lg:mt-24 lg:px-10">
        <a
          href="#work"
          className="group inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-transform duration-300 group-hover:translate-y-1">
            <ArrowDown className="h-3.5 w-3.5" />
          </span>
          Scroll to explore
        </a>
        <p className="hidden text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:block">
          {config.tagline}
        </p>
      </div>
    </section>
  );
}
