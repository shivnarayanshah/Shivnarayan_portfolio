import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import {
  ProjectForm,
  type ProjectFormValues,
} from "@/components/admin/project-form";
import { getAdminProjectById } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) notFound();

  const initialValues: ProjectFormValues = {
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    techStack: project.techStack,
    coverImage: project.coverImage,
    images: project.images,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    featured: project.featured,
    order: project.order,
    status: project.status,
    category: project.category,
    year: project.year,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Projects"
        title={project.title}
        description={`Editing /${project.slug}. Changes to a published project go live immediately.`}
        actions={
          <>
            <Link href="/admin/projects" className="btn-secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            {project.status === "published" ? (
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="btn-primary"
              >
                <ExternalLink className="h-4 w-4" />
                View live
              </Link>
            ) : null}
          </>
        }
      />
      <ProjectForm
        mode="edit"
        projectId={project.id}
        initialValues={initialValues}
        createdAt={project.createdAt}
        updatedAt={project.updatedAt}
      />
    </div>
  );
}
