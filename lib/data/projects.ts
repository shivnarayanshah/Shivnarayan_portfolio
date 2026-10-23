import "server-only";

import { unstable_cache } from "next/cache";
import { Types } from "mongoose";

import { connectDB } from "@/lib/db";
import { escapeRegex } from "@/lib/utils";
import { FALLBACK_PROJECTS } from "@/lib/data/fallback";
import { toProjectDTO } from "@/lib/data/serializers";
import { Project } from "@/models/Project";
import type {
  DashboardStats,
  PaginatedResult,
  ProjectDTO,
  ProjectStatus,
} from "@/lib/types";
import { ContactMessage } from "@/models/ContactMessage";
import { toMessageDTO } from "@/lib/data/serializers";

export const PROJECTS_TAG = "projects";

async function queryPublishedProjects(): Promise<ProjectDTO[]> {
  try {
    await connectDB();
    const projects = await Project.find({ status: "published" })
      .sort({ order: 1, year: -1, createdAt: -1 })
      .lean();

    // A fresh database can connect successfully but still be empty. Use the
    // initial content until the bootstrap seed or an admin creates projects.
    // A non-empty collection with only drafts is left alone intentionally.
    if (projects.length === 0) {
      const total = await Project.countDocuments({});
      if (total === 0) {
        console.warn(
          "[projects] database is empty — using initial static projects.",
        );
        return FALLBACK_PROJECTS;
      }
    }

    return projects.map((project) =>
      toProjectDTO(project as unknown as Parameters<typeof toProjectDTO>[0]),
    );
  } catch (error) {
    console.warn(
      `[projects] falling back to static content: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
    return FALLBACK_PROJECTS;
  }
}

/**
 * Public project list. Cached by tag so admin mutations invalidate it without
 * touching the database on every visit.
 */
export const getPublishedProjects = unstable_cache(
  queryPublishedProjects,
  ["published-projects"],
  { tags: [PROJECTS_TAG], revalidate: 3_600 },
);

export async function getFeaturedProjects(limit = 4) {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.featured).slice(0, limit);
}

const getCachedProjectBySlug = unstable_cache(
  async (slug: string): Promise<ProjectDTO | null> => {
    try {
      await connectDB();
      const project = await Project.findOne({
        slug,
        status: "published",
      }).lean();

      if (!project) {
        const total = await Project.countDocuments({});
        if (total === 0) {
          console.warn(
            `[project:${slug}] database is empty — using initial static project.`,
          );
          return FALLBACK_PROJECTS.find((item) => item.slug === slug) ?? null;
        }
        return null;
      }

      return toProjectDTO(
        project as unknown as Parameters<typeof toProjectDTO>[0],
      );
    } catch (error) {
      console.warn(
        `[project:${slug}] falling back to static content: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
      return FALLBACK_PROJECTS.find((project) => project.slug === slug) ?? null;
    }
  },
  ["project-by-slug"],
  { tags: [PROJECTS_TAG], revalidate: 3_600 },
);

export async function getProjectBySlug(slug: string): Promise<ProjectDTO | null> {
  return getCachedProjectBySlug(slug);
}

export async function getRelatedProjects(
  currentSlug: string,
  category: string,
  limit = 3,
) {
  const projects = await getPublishedProjects();
  const related = projects.filter(
    (project) => project.slug !== currentSlug && project.category === category,
  );
  const fallback = projects.filter((project) => project.slug !== currentSlug);
  return [...related, ...fallback.filter((p) => !related.includes(p))].slice(
    0,
    limit,
  );
}

export interface AdminProjectQuery {
  q?: string;
  status?: ProjectStatus | "all";
  page?: number;
  pageSize?: number;
}

export async function getAdminProjects({
  q = "",
  status = "all",
  page = 1,
  pageSize = 8,
}: AdminProjectQuery): Promise<PaginatedResult<ProjectDTO>> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status !== "all") filter.status = status;

  const term = q.trim();
  if (term) {
    const regex = new RegExp(escapeRegex(term), "i");
    filter.$or = [
      { title: regex },
      { shortDescription: regex },
      { category: regex },
      { techStack: regex },
    ];
  }

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ order: 1, updatedAt: -1 })
      .skip((safePage - 1) * safePageSize)
      .limit(safePageSize)
      .lean(),
    Project.countDocuments(filter),
  ]);

  return {
    items: projects.map((project) =>
      toProjectDTO(project as unknown as Parameters<typeof toProjectDTO>[0]),
    ),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function getAdminProjectById(id: string): Promise<ProjectDTO | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const project = await Project.findById(id).lean();
  if (!project) return null;
  return toProjectDTO(
    project as unknown as Parameters<typeof toProjectDTO>[0],
  );
}

export async function getAllProjectsForReorder(): Promise<ProjectDTO[]> {
  await connectDB();
  const projects = await Project.find({})
    .sort({ order: 1, updatedAt: -1 })
    .lean();
  return projects.map((project) =>
    toProjectDTO(project as unknown as Parameters<typeof toProjectDTO>[0]),
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    totalMessages,
    unreadMessages,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    Project.countDocuments({}),
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ status: "draft" }),
    ContactMessage.countDocuments({}),
    ContactMessage.countDocuments({ read: false }),
    Project.find({}).sort({ updatedAt: -1 }).limit(5).lean(),
    ContactMessage.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalProjects,
    publishedProjects,
    draftProjects,
    totalMessages,
    unreadMessages,
    recentProjects: recentProjects.map((project) =>
      toProjectDTO(project as unknown as Parameters<typeof toProjectDTO>[0]),
    ),
    recentMessages: recentMessages.map((message) =>
      toMessageDTO(message as unknown as Parameters<typeof toMessageDTO>[0]),
    ),
  };
}
