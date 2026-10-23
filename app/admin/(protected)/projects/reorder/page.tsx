import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectReorder } from "@/components/admin/project-reorder";
import { getAllProjectsForReorder } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Reorder projects" };

export default async function ReorderProjectsPage() {
  const projects = await getAllProjectsForReorder();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Projects"
        title="Reorder work"
        description="Set the order projects appear in across the site."
        actions={
          <Link href="/admin/projects" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        }
      />
      <ProjectReorder projects={projects} />
    </div>
  );
}
