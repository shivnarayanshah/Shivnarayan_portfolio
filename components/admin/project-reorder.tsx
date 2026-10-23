"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reorderProjects } from "@/lib/actions/projects";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortableProject({
  project,
  index,
}: {
  project: ProjectDTO;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-line bg-surface/50 px-3 py-3 sm:gap-4 sm:px-4",
        isDragging && "relative z-20 border-accent/40 bg-surface shadow-xl",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${project.title} to reorder`}
        className="inline-flex h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-ink active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="w-5 shrink-0 text-center font-display text-sm italic text-muted">
        {index + 1}
      </span>

      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="56px"
            unoptimized={project.coverImage.endsWith(".svg")}
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[0.55rem] text-muted">
            No cover
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] font-medium text-ink">
          {project.title}
        </p>
        <p className="truncate text-[0.62rem] text-muted">
          /{project.slug} · {project.category}
        </p>
      </div>

      <Badge variant={project.status === "published" ? "sage" : "outline"}>
        {project.status}
      </Badge>
    </li>
  );
}

export function ProjectReorder({
  projects: initialProjects,
}: {
  projects: ProjectDTO[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dirty = projects.some(
    (project, index) => project.id !== initialProjects[index]?.id,
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProjects((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  async function save() {
    setSaving(true);
    const result = await reorderProjects(projects.map((project) => project.id));
    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message ?? "Order saved.");
    router.push("/admin/projects");
    router.refresh();
  }

  if (!projects.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong bg-surface/20 px-6 py-16 text-center">
        <p className="font-display text-2xl text-ink">No projects to order.</p>
        <p className="mt-2 text-sm text-muted">
          Create a project first, then come back to arrange the work.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/30 px-4 py-3">
        <p className="text-[0.7rem] leading-relaxed text-muted">
          Drag with the handle, or focus it and use the arrow keys. The order is
          shared by the home page and the projects index.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setProjects(initialProjects)}
            disabled={!dirty || saving}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={save}
            loading={saving}
            disabled={!dirty}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save order"}
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((project) => project.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {projects.map((project, index) => (
              <SortableProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <p className="text-[0.65rem] text-muted">
        {dirty
          ? "You have unsaved changes."
          : "Order is up to date. Drag a project to change it."}
      </p>
    </div>
  );
}
