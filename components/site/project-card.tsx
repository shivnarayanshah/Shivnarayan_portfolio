"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index = 0,
  className,
  reveal = true,
}: {
  project: ProjectDTO;
  index?: number;
  className?: string;
  /** Disable the GSAP reveal when a parent already animates the card. */
  reveal?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 140, damping: 18 });
  const rotateY = useSpring(rawRotateY, { stiffness: 140, damping: 18 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(x * 5);
    rawRotateX.set(y * -4);
  }

  function onPointerLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      initial={false}
      data-reveal={reveal ? "" : undefined}
      data-reveal-delay={reveal ? String(index * 0.06) : undefined}
      className={cn("group relative", className)}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`View ${project.title}`}
      >
        <div className="project-cover aspect-[16/10] rounded-[1.4rem] border border-line shadow-[0_24px_60px_-45px_rgba(0,0,0,0.5)]">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={`${project.title} cover`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
              unoptimized={project.coverImage.endsWith(".svg")}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_60%),var(--surface-muted)]">
              <span className="font-display text-6xl italic text-ink/30">
                {project.title.slice(0, 2)}
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4">
            <span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
              {project.category}
            </span>
            {project.featured ? (
              <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[0.6rem] font-medium text-white backdrop-blur-md">
                Featured
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-4 right-4 z-10 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              <span>{project.year}</span>
              <span className="h-px w-4 bg-line-strong" />
              <span>{project.techStack[0]}</span>
            </div>
            <h3 className="mt-2 font-display text-[1.6rem] leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-md text-[0.82rem] leading-relaxed text-muted">
              {project.shortDescription}
            </p>
          </div>
          <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-accent-ink">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
          {project.techStack.length > 4 ? (
            <li className="tag">+{project.techStack.length - 4}</li>
          ) : null}
        </ul>
      </Link>
    </motion.article>
  );
}
