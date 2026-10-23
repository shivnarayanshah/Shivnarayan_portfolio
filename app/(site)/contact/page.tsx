import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/social-links";
import { getSiteConfig } from "@/lib/data/site-config";

export const revalidate = 3_600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with ShivNarayan Sah — full-stack developer in Kathmandu, Nepal. Available for full-time roles and select freelance projects.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — ShivNarayan Sah",
    description:
      "Available for full-time roles and select freelance projects. Let's talk about what you're building.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
        <div
          aria-hidden
          className="orb -right-24 top-16 h-[26rem] w-[26rem] bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]"
        />
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted backdrop-blur"
            data-reveal
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {config.availability}
          </p>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div>
              <h1
                className="max-w-3xl font-display text-[clamp(3rem,2rem+4.8vw,5.6rem)] leading-[0.93] tracking-[-0.035em] text-ink"
                data-reveal
              >
                Let&apos;s make
                <br />
                <span className="italic text-gradient">something good.</span>
              </h1>
            </div>
            <p
              className="max-w-md text-[0.95rem] leading-[1.8] text-muted lg:pb-2"
              data-reveal
              data-reveal-delay="0.1"
            >
              A new product, a rebuild, a role, or just a tricky problem — I read
              every message myself. Tell me what you&apos;re working on.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <aside className="space-y-8" data-reveal>
              <div className="rounded-[1.5rem] border border-line bg-surface/40 p-6 backdrop-blur-sm">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  Direct
                </p>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href={`mailto:${config.email}`}
                      className="group flex items-start gap-3"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent">
                        <Mail className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                          Email
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-ink transition-colors group-hover:text-accent">
                          {config.email}
                        </span>
                      </span>
                    </a>
                  </li>
                  {config.phone ? (
                    <li>
                      <a
                        href={`tel:${config.phone.replace(/\s/g, "")}`}
                        className="group flex items-start gap-3"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent">
                          <Phone className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                            Phone
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-ink transition-colors group-hover:text-accent">
                            {config.phone}
                          </span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-sage">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Based in
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-ink">
                        {config.location}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-gold">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                        Response time
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-ink">
                        Usually within a day
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-line bg-surface/30 p-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  Elsewhere
                </p>
                <SocialLinks socials={config.socials} className="mt-4" />
                <div className="mt-6 border-t border-line pt-5">
                  <a
                    href={config.resumeUrl || "/shivnarayan.pdf"}
                    download="ShivNarayan-Sah-Resume.pdf"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
                  >
                    <Download className="h-4 w-4 text-muted" />
                    Download résumé
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              <p className="px-1 text-[0.72rem] leading-relaxed text-muted">
                Prefer a quick call? Send a message with a little context and
                I&apos;ll suggest a time. I&apos;m in Nepal (GMT+5:45), but happy
                to work across time zones.
              </p>
            </aside>

            <div data-reveal data-reveal-delay="0.08">
              <ContactForm email={config.email} />
            </div>
          </div>

          <div
            className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[0.68rem] uppercase tracking-[0.16em] text-muted"
            data-reveal
          >
            <span>Full-time roles · Freelance · Collaboration</span>
            <Link href="/projects" className="link-underline normal-case tracking-normal">
              See the work first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
