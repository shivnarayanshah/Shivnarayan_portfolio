import { z } from "zod";

const imageRef = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) =>
      value === "" ||
      (value.startsWith("/") && !value.startsWith("//")) ||
      /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a valid image URL.",
  );

const optionalHttpUrl = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a valid URL starting with http:// or https://.",
  );

export const projectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters.")
    .max(90, "Slug must be 90 characters or fewer.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only.",
    ),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters.")
    .max(280, "Short description must be 280 characters or fewer."),
  longDescription: z
    .string()
    .max(60_000, "Description is too long.")
    .default(""),
  techStack: z
    .array(z.string().trim().min(1).max(50))
    .min(1, "Add at least one technology.")
    .max(24, "Add at most 24 technologies.")
    .transform((items) => Array.from(new Set(items))),
  coverImage: imageRef.default(""),
  images: z.array(imageRef).max(12, "Add at most 12 gallery images.").default([]),
  liveUrl: optionalHttpUrl.default(""),
  repoUrl: optionalHttpUrl.default(""),
  featured: z.boolean().default(false),
  order: z.coerce
    .number()
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(9999)
    .default(0),
  status: z.enum(["published", "draft"]).default("draft"),
  category: z
    .string()
    .trim()
    .min(2, "Category is required.")
    .max(60, "Category must be 60 characters or fewer.")
    .default("Project"),
  year: z.coerce
    .number()
    .int("Year must be a whole number.")
    .min(2000, "Enter a valid year.")
    .max(2100, "Enter a valid year."),
});

export const projectIdSchema = z.object({
  id: z.string().trim().min(1, "Project ID is required."),
});

export const reorderProjectsSchema = z.object({
  ids: z
    .array(z.string().trim().min(1))
    .min(1, "No projects to reorder.")
    .max(500),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectInputSchema = typeof projectInputSchema;

export function zodFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.map(String).join(".") : "form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}
