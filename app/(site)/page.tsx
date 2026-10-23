import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AboutPreview } from "@/components/site/about-preview";
import { ContactCTA } from "@/components/site/contact-cta";
import { ExperienceSection } from "@/components/site/experience-section";
import { Hero } from "@/components/site/hero";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkillsMarquee } from "@/components/site/skills-marquee";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteConfig } from "@/lib/data/site-config";

export const revalidate = 3_600;

export default async function HomePage() {
  const [config, featured] = await Promise.all([
    getSiteConfig(),
    getFeaturedProjects(4),
  ]);

  return (
    <>
      <Hero config={config} />
      <SkillsMarquee />

      <section id="work" className="relative py-20 sm:py-28">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Products built to
                <br />
                <span className="italic text-muted">be used, not just seen.</span>
              </>
            }
            description="A selection of platforms and business applications I've designed, built, and maintained end to end."
            action={
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/40 px-5 py-3 text-[0.78rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface"
              >
                All projects
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
          />

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {featured.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {!featured.length ? (
            <div className="mt-12 rounded-[1.5rem] border border-dashed border-line-strong bg-surface/20 p-12 text-center">
              <p className="font-display text-2xl text-ink">
                Work is being updated.
              </p>
              <p className="mt-2 text-sm text-muted">
                Check back soon, or get in touch to see recent examples.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <AboutPreview config={config} />
      <ExperienceSection compact />
      <ContactCTA config={config} />
    </>
  );
}
