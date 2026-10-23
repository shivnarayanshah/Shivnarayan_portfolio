import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { ContactCTA } from "@/components/site/contact-cta";
import { ProjectExplorer } from "@/components/site/project-explorer";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublishedProjects } from "@/lib/data/projects";
import { getSiteConfig } from "@/lib/data/site-config";

export const revalidate = 3_600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected full-stack projects by ShivNarayan Sah — business platforms, healthcare sites, and product experiments built with React, Next.js, Node.js, and MongoDB.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — ShivNarayan Sah",
    description:
      "Selected full-stack projects built with React, Next.js, Node.js, and MongoDB.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const [projects, config] = await Promise.all([
    getPublishedProjects(),
    getSiteConfig(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
        <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
        <div
          aria-hidden
          className="orb -right-32 top-20 h-[24rem] w-[24rem] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]"
        />
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted backdrop-blur"
            data-reveal
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            The work · {projects.length} projects
          </p>
          <h1
            className="max-w-4xl font-display text-[clamp(3rem,2rem+5vw,5.8rem)] leading-[0.94] tracking-[-0.035em] text-ink"
            data-reveal
          >
            Real products,
            <br />
            <span className="italic text-gradient">real constraints.</span>
          </h1>
          <p
            className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted"
            data-reveal
            data-reveal-delay="0.1"
          >
            A collection of full-stack work — from a connected business platform
            to local healthcare sites. Each one shipped, maintained, and shaped
            by actual use.
          </p>

          <div
            className="mt-10 flex flex-wrap gap-6 border-t border-line pt-6 text-[0.68rem] uppercase tracking-[0.16em] text-muted"
            data-reveal
          >
            <span>React · Next.js</span>
            <span>Node.js · MongoDB</span>
            <span>Design systems</span>
            <span>Deployment</span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <ProjectExplorer projects={projects} />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Beyond the list"
            title={
              <>
                The interesting part is
                <br />
                <span className="italic text-muted">how it was built.</span>
              </>
            }
            description="Every project here is more than a screenshot. Open one to read the decisions, constraints, and details behind it."
            action={
              <a
                href={`mailto:${config.email}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                Ask about a project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            }
          />
        </div>
      </section>

      <ContactCTA config={config} />
    </>
  );
}
