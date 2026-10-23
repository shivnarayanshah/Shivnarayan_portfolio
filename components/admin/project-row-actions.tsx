"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  deleteProject,
  toggleProjectStatus,
} from "@/lib/actions/projects";
import type { ProjectDTO } from "@/lib/types";

export function ProjectRowActions({ project }: { project: ProjectDTO }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState<"toggle" | "delete" | null>(null);

  async function handleToggle() {
    setBusy("toggle");
    const result = await toggleProjectStatus(project.id);
    setBusy(null);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message ?? "Status updated.");
    router.refresh();
  }

  async function handleDelete() {
    setBusy("delete");
    const result = await deleteProject(project.id);
    setBusy(null);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message ?? "Project deleted.");
    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={handleToggle}
          disabled={busy !== null}
          title={project.status === "published" ? "Move to drafts" : "Publish"}
          aria-label={
            project.status === "published" ? "Move to drafts" : "Publish project"
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink disabled:opacity-50"
        >
          {busy === "toggle" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : project.status === "published" ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>

        {project.status === "published" ? (
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            title="View public page"
            aria-label="View public page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}

        <Link
          href={`/admin/projects/${project.id}/edit`}
          title="Edit project"
          aria-label="Edit project"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          disabled={busy !== null}
          title="Delete project"
          aria-label="Delete project"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => {
          if (busy !== "delete") setDeleteOpen(false);
        }}
        title={`Delete “${project.title}”?`}
        description="This permanently removes the project and its case study. The public page will stop working immediately."
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              disabled={busy === "delete"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              loading={busy === "delete"}
            >
              Delete project
            </Button>
          </>
        }
      >
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-relaxed text-muted">
          <strong className="text-ink">Careful:</strong> this cannot be undone.
          If you only want to hide it, move it to drafts instead.
        </div>
      </Modal>
    </>
  );
}
