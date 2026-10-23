import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Layers,
} from "lucide-react";

import { GithubIcon } from "@/components/site/social-links";

import { ContactCTA } from "@/components/site/contact-cta";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectGallery } from "@/components/site/project-gallery";
import { getProjectBySlug, getRelatedProjects } from "@/lib/data/projects";
import { getSiteConfig } from "@/lib/data/site-config";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const revalidate = 3_600;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const description = project.shortDescription;
  const image = project.coverImage
    ? absoluteUrl(project.coverImage)
    : absoluteUrl(
        `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(
          project.category,
        )}`,
      );

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ShivNarayan Sah`,
      description,
      url: `/projects/${project.slug}`,
      images: [{ url: image, alt: `${project.title} cover` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ShivNarayan Sah`,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [config, related] = await Promise.all([
    getSiteConfig(),
    getRelatedProjects(project.slug, project.category, 2),
  ]);

  const description = sanitizeRichText(project.longDescription);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    keywords: project.techStack.join(", "),
    creator: {
      "@type": "Person",
      name: config.name,
      url: absoluteUrl(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pb-10 pt-28 sm:pt-36">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.34fr] lg:gap-16">
            <header>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-accent">
                  {project.category}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {project.year}
                </span>
                {project.featured ? (
                  <span className="text-[0.65rem] uppercase tracking-[0.14em] text-sage">
                    · Featured
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,2rem+4.8vw,5.6rem)] leading-[0.92] tracking-[-0.035em] text-ink">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.8] text-muted">
                {project.shortDescription}
              </p>

              <ul className="mt-7 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Visit live site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Source
                  </a>
                ) : null}
              </div>
            </header>

            <aside className="lg:pt-12">
              <dl className="divide-y divide-line rounded-[1.4rem] border border-line bg-surface/40 px-5 py-2 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    <Layers className="h-3.5 w-3.5" />
                    Role
                  </dt>
                  <dd className="text-right text-xs font-medium text-ink">
                    Full-stack developer
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    Year
                  </dt>
                  <dd className="text-right text-xs font-medium text-ink">
                    {project.year}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    Category
                  </dt>
                  <dd className="text-right text-xs font-medium text-ink">
                    {project.category}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    Updated
                  </dt>
                  <dd className="text-right text-xs font-medium text-ink">
                    {formatDate(project.updatedAt, {
                      month: "short",
                      year: "numeric",
                      day: undefined,
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    Stack
                  </dt>
                  <dd className="max-w-[10rem] text-right text-xs font-medium leading-relaxed text-ink">
                    {project.techStack.slice(0, 3).join(", ")}
                    {project.techStack.length > 3 ? "…" : ""}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>

          {project.coverImage ? (
            <div className="project-cover mt-10 aspect-[16/9] rounded-[1.6rem] border border-line shadow-[0_40px_100px_-60px_rgba(0,0,0,0.6)] sm:mt-12">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 84rem"
                unoptimized={project.coverImage.endsWith(".svg")}
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.32fr_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  In this case study
                </p>
                <ul className="mt-4 space-y-2 border-l border-line pl-4 text-xs leading-relaxed text-muted">
                  <li>Context & goals</li>
                  <li>What was built</li>
                  <li>Decisions & tradeoffs</li>
                  <li>Outcome</li>
                </ul>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium text-accent"
                  >
                    View it live
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </aside>

            <div>
              <div
                className="prose-editorial max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    description ||
                    `<p>${project.shortDescription}</p><p>A fuller case study for this project is on its way. In the meantime, get in touch if you'd like to talk through the build.</p>`,
                }}
              />

              <ProjectGallery images={project.images} title={project.title} />
            </div>
          </div>

          {related.length ? (
            <section className="mt-20 border-t border-line pt-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                  More work
                </h2>
                <Link
                  href="/projects"
                  className="link-underline text-sm font-medium text-muted"
                >
                  View all projects
                </Link>
              </div>
              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {related.map((item, index) => (
                  <ProjectCard key={item.id} project={item} index={index} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <ContactCTA config={config} />
    </>
  );
}
