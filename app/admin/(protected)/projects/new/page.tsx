import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import {
  ProjectForm,
  type ProjectFormValues,
} from "@/components/admin/project-form";
import { getAllProjectsForReorder } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  const projects = await getAllProjectsForReorder();
  const nextOrder = projects.reduce(
    (highest, project) => Math.max(highest, project.order),
    -1,
  ) + 1;

  const initialValues: ProjectFormValues = {
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    techStack: [],
    coverImage: "",
    images: [],
    liveUrl: "",
    repoUrl: "",
    featured: false,
    order: nextOrder,
    status: "draft",
    category: "Platform",
    year: new Date().getFullYear(),
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Projects"
        title="New project"
        description="Add a new case study. It stays hidden until you publish it."
        actions={
          <Link href="/admin/projects" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        }
      />
      <ProjectForm mode="create" initialValues={initialValues} />
    </div>
  );
}
