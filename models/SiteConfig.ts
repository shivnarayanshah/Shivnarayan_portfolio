import { Schema, model, models, type Model, type Types } from "mongoose";

export interface SiteConfigDocument {
  _id: Types.ObjectId;
  key: "main";
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  heroTitle: string;
  heroAccent: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  profileImage: string;
  resumeUrl: string;
  availability: string;
  socials: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteConfigSchema = new Schema<SiteConfigDocument>(
  {
    key: { type: String, default: "main", unique: true, enum: ["main"] },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    shortName: { type: String, required: true, trim: true, maxlength: 60 },
    role: { type: String, required: true, trim: true, maxlength: 100 },
    tagline: { type: String, default: "", maxlength: 160 },
    heroTitle: { type: String, required: true, maxlength: 240 },
    heroAccent: { type: String, default: "", maxlength: 160 },
    summary: { type: String, required: true, maxlength: 2_000 },
    location: { type: String, default: "", maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", maxlength: 40 },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    availability: { type: String, default: "", maxlength: 160 },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
  },
  { timestamps: true, versionKey: false },
);

export const SiteConfig: Model<SiteConfigDocument> =
  (models.SiteConfig as Model<SiteConfigDocument> | undefined) ??
  model<SiteConfigDocument>("SiteConfig", SiteConfigSchema);
