import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectRowActions } from "@/components/admin/project-row-actions";
import { ProjectToolbar } from "@/components/admin/project-toolbar";
import { Badge } from "@/components/ui/badge";
import { getAdminProjects } from "@/lib/data/projects";
import type { ProjectStatus } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Projects" };

type SearchParams = {
  q?: string;
  status?: string;
  page?: string;
};

function buildHref({
  q,
  status,
  page,
}: {
  q?: string;
  status?: string;
  page: number;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status && status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/projects?${query}` : "/admin/projects";
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status: ProjectStatus | "all" =
    params.status === "published" || params.status === "draft"
      ? params.status
      : "all";
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getAdminProjects({
    q,
    status,
    page,
    pageSize: 8,
  });

  const hasFilters = Boolean(q) || status !== "all";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Projects"
        description="Create, edit, publish, and order the work shown on the public site."
        actions={
          <>
            <Link href="/admin/projects/reorder" className="btn-secondary">
              <Sparkles className="h-4 w-4" />
              Reorder
            </Link>
            <Link href="/admin/projects/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              New project
            </Link>
          </>
        }
      />

      <ProjectToolbar />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface/30">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            {result.total} {result.total === 1 ? "project" : "projects"}
            {hasFilters ? " · filtered" : ""}
          </p>
          <p className="text-[0.65rem] text-muted">
            Page {result.page} of {result.totalPages}
          </p>
        </div>

        {result.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left">
              <thead>
                <tr className="border-b border-line text-[0.58rem] uppercase tracking-[0.16em] text-muted">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Project
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Order
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Updated
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {result.items.map((project) => (
                  <tr key={project.id} className="admin-table-row">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-muted">
                          {project.coverImage ? (
                            <Image
                              src={project.coverImage}
                              alt=""
                              fill
                              sizes="48px"
                              unoptimized={project.coverImage.endsWith(".svg")}
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[0.58rem] text-muted">
                              No cover
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="flex items-center gap-1.5 truncate text-[0.8rem] font-medium text-ink transition-colors hover:text-accent"
                          >
                            {project.title}
                            {project.featured ? (
                              <Star className="h-3 w-3 fill-gold/40 text-gold" />
                            ) : null}
                          </Link>
                          <p className="truncate text-[0.62rem] text-muted">
                            /{project.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      {project.category}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge
                        variant={
                          project.status === "published" ? "sage" : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3.5 text-xs tabular-nums text-muted">
                      {project.order}
                    </td>
                    <td className="px-3 py-3.5 text-[0.68rem] text-muted">
                      {formatRelativeDate(project.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <ProjectRowActions project={project} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
              <FolderKanban className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-2xl text-ink">
              {hasFilters ? "No matching projects." : "No projects yet."}
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              {hasFilters
                ? "Try a different search term or status filter."
                : "Add the first project and it will appear here."}
            </p>
            {hasFilters ? (
              <Link
                href="/admin/projects"
                className="mt-5 text-xs font-medium text-accent underline underline-offset-4"
              >
                Clear filters
              </Link>
            ) : (
              <Link href="/admin/projects/new" className="btn-primary mt-6">
                <Plus className="h-4 w-4" />
                New project
              </Link>
            )}
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <nav
          aria-label="Project pagination"
          className="flex items-center justify-between gap-4"
        >
          <Link
            href={buildHref({ q, status, page: Math.max(1, result.page - 1) })}
            aria-disabled={result.page <= 1}
            className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-4 py-2 text-xs font-medium ${
              result.page <= 1
                ? "pointer-events-none opacity-40"
                : "text-ink hover:bg-surface"
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Link>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: result.totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === result.totalPages ||
                  Math.abs(pageNumber - result.page) <= 1,
              )
              .map((pageNumber, index, list) => {
                const previous = list[index - 1];
                const gap = previous && pageNumber - previous > 1;
                return (
                  <span key={pageNumber} className="flex items-center gap-1.5">
                    {gap ? (
                      <span className="px-1 text-[0.65rem] text-muted">…</span>
                    ) : null}
                    <Link
                      href={buildHref({ q, status, page: pageNumber })}
                      aria-current={
                        pageNumber === result.page ? "page" : undefined
                      }
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[0.68rem] font-medium ${
                        pageNumber === result.page
                          ? "border-accent/30 bg-accent text-accent-ink"
                          : "border-line bg-surface/40 text-muted hover:text-ink"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  </span>
                );
              })}
          </div>

          <Link
            href={buildHref({
              q,
              status,
              page: Math.min(result.totalPages, result.page + 1),
            })}
            aria-disabled={result.page >= result.totalPages}
            className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-4 py-2 text-xs font-medium ${
              result.page >= result.totalPages
                ? "pointer-events-none opacity-40"
                : "text-ink hover:bg-surface"
            }`}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
