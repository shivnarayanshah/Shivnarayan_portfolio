"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import {
  ArrowUpRight,
  CalendarClock,
  ExternalLink,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  GalleryUploader,
  ImageUploader,
} from "@/components/admin/image-uploader";
import { TagInput } from "@/components/admin/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { createProject, updateProject } from "@/lib/actions/projects";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { projectFormSchema } from "@/lib/validations/forms";
import type { ProjectStatus } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";

const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/rich-text-editor").then(
      (module) => module.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[26rem] items-center justify-center rounded-xl border border-line bg-surface/40 text-xs text-muted">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading editor…
      </div>
    ),
  },
);

export interface ProjectFormValues {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  coverImage: string;
  images: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  category: string;
  year: number;
}

function FormCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface/30">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[0.68rem] leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ProjectForm({
  mode,
  projectId,
  initialValues,
  createdAt,
  updatedAt,
}: {
  mode: "create" | "edit";
  projectId?: string;
  initialValues: ProjectFormValues;
  createdAt?: string;
  updatedAt?: string;
}) {
  const router = useRouter();
  const slugEdited = useRef(mode === "edit");

  return (
    <Formik<ProjectFormValues>
      initialValues={initialValues}
      validationSchema={projectFormSchema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        const result =
          mode === "create"
            ? await createProject(values)
            : await updateProject(projectId ?? "", values);

        if (!result.success) {
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              if (messages?.[0]) helpers.setFieldError(field, messages[0]);
            }
          }
          helpers.setStatus(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(
          result.message ??
            (mode === "create" ? "Project created." : "Project updated."),
        );
        router.push("/admin/projects");
        router.refresh();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        status,
      }) => (
        <Form noValidate className="space-y-6">
          <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-[var(--nav)] px-4 py-3 backdrop-blur-xl lg:top-20">
            <div className="min-w-0">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted">
                {mode === "create" ? "New project" : "Editing"}
              </p>
              <p className="truncate text-sm font-medium text-ink">
                {values.title || "Untitled project"}
                <span className="ml-2 hidden text-[0.65rem] font-normal text-muted sm:inline">
                  /{values.slug || "slug"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/projects" className="btn-secondary h-10 px-4">
                Cancel
              </Link>
              <Button type="submit" loading={isSubmitting}>
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? "Saving…"
                  : mode === "create"
                    ? "Create project"
                    : "Save changes"}
              </Button>
            </div>
          </div>

          {status ? (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-relaxed text-red-600 dark:text-red-400"
            >
              {status}
            </p>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-6">
              <FormCard
                title="Basics"
                description="The title and summary that appear on cards and search results."
              >
                <div className="space-y-5">
                  <Input
                    name="title"
                    label="Title"
                    placeholder="ByaparHouse"
                    value={values.title}
                    onChange={(event) => {
                      handleChange(event);
                      if (!slugEdited.current) {
                        void setFieldValue("slug", slugify(event.target.value));
                      }
                    }}
                    onBlur={handleBlur}
                    error={touched.title ? errors.title : undefined}
                    required
                  />

                  <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                    <Input
                      name="slug"
                      label="Slug"
                      placeholder="byaparhouse"
                      value={values.slug}
                      onChange={(event) => {
                        slugEdited.current = true;
                        handleChange(event);
                      }}
                      onBlur={handleBlur}
                      error={touched.slug ? errors.slug : undefined}
                      hint="Used in the public URL: /projects/your-slug"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        slugEdited.current = true;
                        void setFieldValue("slug", slugify(values.title));
                      }}
                      className="mb-0.5 inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface/50 px-4 text-[0.7rem] font-medium text-muted transition-colors hover:text-ink"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate
                    </button>
                  </div>

                  <Textarea
                    name="shortDescription"
                    label="Short description"
                    placeholder="One or two sentences that explain what this project is and why it matters."
                    rows={3}
                    maxLength={280}
                    value={values.shortDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.shortDescription
                        ? errors.shortDescription
                        : undefined
                    }
                    hint={`${values.shortDescription.length}/280 characters`}
                    required
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Input
                        name="category"
                        label="Category"
                        list="project-categories"
                        placeholder="Platform"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.category ? errors.category : undefined}
                        required
                      />
                      <datalist id="project-categories">
                        {PROJECT_CATEGORIES.map((category) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                    </div>
                    <Input
                      name="year"
                      type="number"
                      label="Year"
                      min={2000}
                      max={2100}
                      value={values.year}
                      onChange={(event) =>
                        void setFieldValue("year", Number(event.target.value))
                      }
                      onBlur={handleBlur}
                      error={touched.year ? errors.year : undefined}
                      required
                    />
                  </div>
                </div>
              </FormCard>

              <FormCard
                title="Case study"
                description="The long-form story shown on the project page."
              >
                <RichTextEditor
                  value={values.longDescription}
                  onChange={(html) => void setFieldValue("longDescription", html)}
                  error={
                    touched.longDescription ? errors.longDescription : undefined
                  }
                />
              </FormCard>

              <FormCard
                title="Media"
                description="The cover is used on cards and social previews. Gallery images appear below the case study."
              >
                <div className="space-y-6">
                  <ImageUploader
                    value={values.coverImage}
                    onChange={(value) => void setFieldValue("coverImage", value)}
                    error={touched.coverImage ? errors.coverImage : undefined}
                  />
                  <GalleryUploader
                    value={values.images}
                    onChange={(value) => void setFieldValue("images", value)}
                    error={touched.images ? (errors.images as string) : undefined}
                  />
                </div>
              </FormCard>
            </div>

            <aside className="space-y-6">
              <FormCard
                title="Publishing"
                description="Control visibility and placement."
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="project-status"
                      className="field-label"
                    >
                      <span>Status</span>
                    </label>
                    <select
                      id="project-status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      className="field text-xs"
                    >
                      <option value="draft">Draft — hidden from the site</option>
                      <option value="published">Published — live</option>
                    </select>
                    <p className="mt-1.5 text-[0.65rem] leading-relaxed text-muted">
                      Publishing immediately revalidates the public pages.
                    </p>
                  </div>

                  <Toggle
                    checked={values.featured}
                    onChange={(checked) =>
                      void setFieldValue("featured", checked)
                    }
                    label="Featured project"
                    description="Show this in the selected work section on the home page."
                  />

                  <Input
                    name="order"
                    type="number"
                    label="Order"
                    min={0}
                    max={9999}
                    value={values.order}
                    onChange={(event) =>
                      void setFieldValue("order", Number(event.target.value))
                    }
                    onBlur={handleBlur}
                    error={touched.order ? errors.order : undefined}
                    hint="Lower numbers appear first."
                  />
                </div>
              </FormCard>

              <FormCard
                title="Links"
                description="Where people can see the project in the wild."
              >
                <div className="space-y-5">
                  <Input
                    name="liveUrl"
                    type="url"
                    label="Live URL"
                    placeholder="https://example.com"
                    value={values.liveUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.liveUrl ? errors.liveUrl : undefined}
                  />
                  <Input
                    name="repoUrl"
                    type="url"
                    label="Repository URL"
                    placeholder="https://github.com/…"
                    value={values.repoUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.repoUrl ? errors.repoUrl : undefined}
                  />
                </div>
              </FormCard>

              <FormCard
                title="Tech stack"
                description="The tools and technologies used to build it."
              >
                <TagInput
                  value={values.techStack}
                  onChange={(value) => void setFieldValue("techStack", value)}
                  error={touched.techStack ? (errors.techStack as string) : undefined}
                />
              </FormCard>

              {mode === "edit" ? (
                <div className="rounded-2xl border border-line bg-surface/20 p-5">
                  <p className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Record
                  </p>
                  <dl className="mt-3 space-y-2 text-[0.68rem]">
                    {createdAt ? (
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Created</dt>
                        <dd className="text-ink">{formatDate(createdAt)}</dd>
                      </div>
                    ) : null}
                    {updatedAt ? (
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Updated</dt>
                        <dd className="text-ink">{formatDate(updatedAt)}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {values.status === "published" && values.slug ? (
                    <Link
                      href={`/projects/${values.slug}`}
                      target="_blank"
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-accent"
                    >
                      View public page
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="rounded-2xl border border-line bg-surface/20 p-5 text-[0.68rem] leading-relaxed text-muted">
                <p className="flex items-center gap-1.5 font-medium text-ink">
                  <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                  Before publishing
                </p>
                <ul className="mt-2 space-y-1.5">
                  <li>· Cover image is clear at card size.</li>
                  <li>· Summary works without the case study.</li>
                  <li>· Live link opens and is public.</li>
                  <li>· Tech stack is accurate.</li>
                </ul>
              </div>
            </aside>
          </div>
        </Form>
      )}
    </Formik>
  );
}
