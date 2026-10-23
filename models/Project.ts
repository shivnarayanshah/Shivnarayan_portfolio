import { Schema, model, models, type Model, type Types } from "mongoose";

import type { ProjectStatus } from "@/lib/types";

export interface ProjectDocument {
  _id: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 90,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280,
    },
    longDescription: { type: String, default: "" },
    techStack: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 24,
        message: "A project can have at most 24 technologies.",
      },
    },
    coverImage: { type: String, default: "" },
    images: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["published", "draft"] satisfies ProjectStatus[],
      default: "draft",
      index: true,
    },
    category: { type: String, default: "Project", trim: true, maxlength: 60 },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
      min: 2000,
      max: 2100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ProjectSchema.index({ status: 1, order: 1, createdAt: -1 });
ProjectSchema.index({ featured: 1, status: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({
  title: "text",
  shortDescription: "text",
  techStack: "text",
  category: "text",
});

export const Project: Model<ProjectDocument> =
  (models.Project as Model<ProjectDocument> | undefined) ??
  model<ProjectDocument>("Project", ProjectSchema);
