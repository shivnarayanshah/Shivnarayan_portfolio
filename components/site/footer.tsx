import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { SocialLinks } from "@/components/site/social-links";
import { NAV_LINKS } from "@/lib/constants";
import type { SiteConfigDTO } from "@/lib/types";

export function Footer({ config }: { config: SiteConfigDTO }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-line bg-surface/30">
      <div className="mx-auto w-full max-w-[84rem] px-5 pb-8 pt-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface font-display text-base italic">
                SN
              </span>
              <span className="font-display text-xl tracking-tight text-ink">
                {config.name}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {config.tagline}. Building considered, production-ready products
              from Kathmandu, Nepal.
            </p>
            <SocialLinks socials={config.socials} className="mt-6" size="sm" />
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Get in touch
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${config.email}`}
                  className="link-underline text-ink-soft hover:text-ink"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {config.email}
                </a>
              </li>
              {config.phone ? (
                <li>
                  <a
                    href={`tel:${config.phone.replace(/\s/g, "")}`}
                    className="link-underline text-ink-soft hover:text-ink"
                  >
                    {config.phone}
                  </a>
                </li>
              ) : null}
              <li className="flex items-start gap-1.5 text-muted">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {config.location}
              </li>
            </ul>
            {config.resumeUrl ? (
              <a
                href={config.resumeUrl}
                download
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent"
              >
                Download résumé
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[0.7rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {config.name}. Built with Next.js, MongoDB, and care.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              {config.availability}
            </span>
            <a href="#top" className="transition-colors hover:text-ink">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
