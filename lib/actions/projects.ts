"use server";

import { revalidatePath, updateTag } from "next/cache";
import { Types } from "mongoose";

import { getSession } from "@/lib/auth/session";
import { verifyAdminSessionUser } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db";
import { toProjectDTO } from "@/lib/data/serializers";
import { PROJECTS_TAG } from "@/lib/data/projects";
import {
  projectIdSchema,
  projectInputSchema,
  reorderProjectsSchema,
  zodFieldErrors,
} from "@/lib/validations/project";
import { Project } from "@/models/Project";
import type { ActionResult, ProjectDTO } from "@/lib/types";

function revalidateProjectSurfaces(slug?: string) {
  // Next 16's updateTag expires the cache immediately, giving the editor
  // read-your-own-writes semantics after a mutation.
  updateTag(PROJECTS_TAG);
  revalidatePath("/");
  // "layout" also clears every /projects/[slug] page, whose related-work
  // section can change whenever any project is created, edited, or removed.
  revalidatePath("/projects", "layout");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");
}

async function authorize() {
  const session = await getSession();
  if (!session) {
    return { ok: false as const, error: "Your session has expired. Sign in again." };
  }

  const user = await verifyAdminSessionUser(session);
  if (!user) {
    return { ok: false as const, error: "You are not authorized to do that." };
  }

  return { ok: true as const, session };
}

function actionError(error: unknown, fallback: string) {
  console.error("[admin-action]", error);
  if (error instanceof Error && error.message.includes("duplicate key")) {
    return "A project with that slug already exists.";
  }
  return fallback;
}

export async function createProject(input: unknown): Promise<ActionResult<ProjectDTO>> {
  try {
    const auth = await authorize();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = projectInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: zodFieldErrors(parsed.error),
      };
    }

    await connectDB();

    const slugTaken = await Project.exists({ slug: parsed.data.slug });
    if (slugTaken) {
      return {
        success: false,
        error: "That slug is already in use.",
        fieldErrors: { slug: ["That slug is already in use."] },
      };
    }

    const project = await Project.create(parsed.data);
    const dto = toProjectDTO(
      project.toObject() as unknown as Parameters<typeof toProjectDTO>[0],
    );

    revalidateProjectSurfaces(dto.slug);
    return { success: true, data: dto, message: "Project created." };
  } catch (error) {
    return {
      success: false,
      error: actionError(error, "Could not create the project. Try again."),
    };
  }
}

export async function updateProject(
  id: string,
  input: unknown,
): Promise<ActionResult<ProjectDTO>> {
  try {
    const auth = await authorize();
    if (!auth.ok) return { success: false, error: auth.error };

    const idParsed = projectIdSchema.safeParse({ id });
    if (!idParsed.success || !Types.ObjectId.isValid(idParsed.data.id)) {
      return { success: false, error: "Invalid project ID." };
    }

    const parsed = projectInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: zodFieldErrors(parsed.error),
      };
    }

    await connectDB();

    const slugTaken = await Project.exists({
      slug: parsed.data.slug,
      _id: { $ne: idParsed.data.id },
    });
    if (slugTaken) {
      return {
        success: false,
        error: "That slug is already in use.",
        fieldErrors: { slug: ["That slug is already in use."] },
      };
    }

    const previous = await Project.findById(idParsed.data.id).select("slug").lean();
    const project = await Project.findByIdAndUpdate(idParsed.data.id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!project) return { success: false, error: "Project not found." };

    const dto = toProjectDTO(
      project as unknown as Parameters<typeof toProjectDTO>[0],
    );

    revalidateProjectSurfaces(dto.slug);
    if (previous?.slug && previous.slug !== dto.slug) {
      revalidatePath(`/projects/${previous.slug}`);
    }

    return { success: true, data: dto, message: "Project updated." };
  } catch (error) {
    return {
      success: false,
      error: actionError(error, "Could not update the project. Try again."),
    };
  }
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const auth = await authorize();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = projectIdSchema.safeParse({ id });
    if (!parsed.success || !Types.ObjectId.isValid(parsed.data.id)) {
      return { success: false, error: "Invalid project ID." };
    }

    await connectDB();
    const project = await Project.findByIdAndDelete(parsed.data.id).lean();
    if (!project) return { success: false, error: "Project not found." };

    revalidateProjectSurfaces(project.slug);
    return {
      success: true,
      data: { id: parsed.data.id },
      message: "Project deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: actionError(error, "Could not delete the project. Try again."),
    };
  }
}

export async function toggleProjectStatus(
  id: string,
): Promise<ActionResult<{ id: string; status: "published" | "draft" }>> {
  try {
    const auth = await authorize();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = projectIdSchema.safeParse({ id });
    if (!parsed.success || !Types.ObjectId.isValid(parsed.data.id)) {
      return { success: false, error: "Invalid project ID." };
    }

    await connectDB();
    const project = await Project.findById(parsed.data.id);
    if (!project) return { success: false, error: "Project not found." };

    project.status = project.status === "published" ? "draft" : "published";
    await project.save();

    revalidateProjectSurfaces(project.slug);
    return {
      success: true,
      data: { id: parsed.data.id, status: project.status },
      message:
        project.status === "published"
          ? "Project published."
          : "Project moved to drafts.",
    };
  } catch (error) {
    return {
      success: false,
      error: actionError(error, "Could not change the project status."),
    };
  }
}

export async function reorderProjects(
  ids: string[],
): Promise<ActionResult<{ count: number }>> {
  try {
    const auth = await authorize();
    if (!auth.ok) return { success: false, error: auth.error };

    const parsed = reorderProjectsSchema.safeParse({ ids });
    if (!parsed.success) {
      return { success: false, error: "Invalid project order." };
    }

    if (parsed.data.ids.some((id) => !Types.ObjectId.isValid(id))) {
      return { success: false, error: "One or more project IDs are invalid." };
    }

    await connectDB();

    await Project.bulkWrite(
      parsed.data.ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      })),
    );

    updateTag(PROJECTS_TAG);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/projects/reorder");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { count: parsed.data.ids.length },
      message: "Project order saved.",
    };
  } catch (error) {
    return {
      success: false,
      error: actionError(error, "Could not save the new order."),
    };
  }
}
