import * as yup from "yup";

const httpUrl = yup
  .string()
  .trim()
  .test("is-url", "Enter a valid URL starting with http:// or https://.", (value) =>
    !value ? true : /^https?:\/\/[^\s]+$/i.test(value),
  );

const imageRef = yup
  .string()
  .trim()
  .test("is-image-ref", "Enter a valid image URL.", (value) =>
    !value ? true : value.startsWith("/") || /^https?:\/\/[^\s]+$/i.test(value),
  );

export const projectFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required.")
    .min(2, "Title must be at least 2 characters.")
    .max(120, "Title must be 120 characters or fewer."),
  slug: yup
    .string()
    .trim()
    .required("Slug is required.")
    .min(2, "Slug must be at least 2 characters.")
    .max(90, "Slug must be 90 characters or fewer.")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only.",
    ),
  shortDescription: yup
    .string()
    .trim()
    .required("Short description is required.")
    .min(10, "Short description must be at least 10 characters.")
    .max(280, "Short description must be 280 characters or fewer."),
  longDescription: yup.string().max(60_000, "Description is too long."),
  techStack: yup
    .array()
    .of(yup.string().trim().required())
    .min(1, "Add at least one technology.")
    .max(24, "Add at most 24 technologies.")
    .required("Add at least one technology."),
  coverImage: imageRef,
  images: yup.array().of(imageRef.required()).max(12, "Add at most 12 images."),
  liveUrl: httpUrl,
  repoUrl: httpUrl,
  featured: yup.boolean(),
  order: yup
    .number()
    .typeError("Order must be a number.")
    .integer("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(9999, "Order is too large.")
    .required("Order is required."),
  status: yup.string().oneOf(["published", "draft"]).required(),
  category: yup
    .string()
    .trim()
    .required("Category is required.")
    .max(60, "Category must be 60 characters or fewer."),
  year: yup
    .number()
    .typeError("Year must be a number.")
    .integer("Year must be a whole number.")
    .min(2000, "Enter a valid year.")
    .max(2100, "Enter a valid year.")
    .required("Year is required."),
});

export const loginFormSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Your name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  subject: yup
    .string()
    .trim()
    .max(160, "Subject must be 160 characters or fewer."),
  message: yup
    .string()
    .trim()
    .required("Please write a message.")
    .min(10, "Message must be at least 10 characters.")
    .max(5_000, "Message must be 5,000 characters or fewer."),
  website: yup.string(),
});

export const siteConfigFormSchema = yup.object({
  name: yup.string().trim().required("Name is required.").max(100),
  shortName: yup.string().trim().required("Short name is required.").max(60),
  role: yup.string().trim().required("Role is required.").max(100),
  tagline: yup.string().trim().max(160),
  heroTitle: yup
    .string()
    .trim()
    .required("Hero title is required.")
    .min(10, "Hero title must be at least 10 characters.")
    .max(240),
  heroAccent: yup.string().trim().max(160),
  summary: yup
    .string()
    .trim()
    .required("Summary is required.")
    .min(40, "Summary must be at least 40 characters.")
    .max(2_000),
  location: yup.string().trim().max(160),
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Enter a valid email address."),
  phone: yup.string().trim().max(40),
  profileImage: imageRef,
  resumeUrl: imageRef,
  availability: yup.string().trim().max(160),
  socials: yup.object({
    github: httpUrl,
    linkedin: httpUrl,
    portfolio: httpUrl,
  }),
});
