import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a valid URL starting with http:// or https://.",
  );

const imageRef = z
  .string()
  .trim()
  .max(2_000)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a valid image URL.",
  );

export const siteConfigSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(100),
  shortName: z.string().trim().min(2, "Short name is required.").max(60),
  role: z.string().trim().min(2, "Role is required.").max(100),
  tagline: z.string().trim().max(160).default(""),
  heroTitle: z
    .string()
    .trim()
    .min(10, "Hero title must be at least 10 characters.")
    .max(240),
  heroAccent: z.string().trim().max(160).default(""),
  summary: z
    .string()
    .trim()
    .min(40, "Summary must be at least 40 characters.")
    .max(2_000),
  location: z.string().trim().max(160).default(""),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  phone: z.string().trim().max(40).default(""),
  profileImage: imageRef.default(""),
  resumeUrl: imageRef.default(""),
  availability: z.string().trim().max(160).default(""),
  socials: z
    .object({
      github: optionalUrl.default(""),
      linkedin: optionalUrl.default(""),
      portfolio: optionalUrl.default(""),
    })
    .default({ github: "", linkedin: "", portfolio: "" }),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;
