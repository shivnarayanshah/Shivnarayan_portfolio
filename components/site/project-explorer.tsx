"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

import { ProjectCard } from "@/components/site/project-card";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectExplorer({ projects }: { projects: ProjectDTO[] }) {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory =
        category === "All" || project.category === category;
      if (!matchesCategory) return false;
      if (!term) return true;
      return [
        project.title,
        project.shortDescription,
        project.category,
        project.techStack.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [category, projects, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5 shrink-0 text-muted" />
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-[0.7rem] font-medium transition-all duration-300",
                category === item
                  ? "border-accent/30 bg-accent text-accent-ink shadow-sm"
                  : "border-line bg-surface/40 text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative flex w-full items-center lg:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, tech…"
            className="field h-10 pl-9 text-xs"
          />
        </label>
      </div>

      <p className="mt-5 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {category !== "All" ? ` · ${category}` : ""}
      </p>

      <motion.div
        layout={!reduced}
        className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.35, delay: index * 0.03 }
              }
            >
              <ProjectCard project={project} index={index} reveal={false} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!filtered.length ? (
        <div className="mt-10 rounded-[1.5rem] border border-dashed border-line-strong bg-surface/20 px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink">Nothing here yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try a different search term or category. More work is always being
            added.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 text-sm font-medium text-accent underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
