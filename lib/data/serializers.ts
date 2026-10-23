import type { ContactMessageDocument } from "@/models/ContactMessage";
import type { ProjectDocument } from "@/models/Project";
import type { SiteConfigDocument } from "@/models/SiteConfig";
import type {
  ContactMessageDTO,
  ProjectDTO,
  SiteConfigDTO,
} from "@/lib/types";

type LeanProject = ProjectDocument;
type LeanMessage = ContactMessageDocument;
type LeanSiteConfig = SiteConfigDocument;

export function toProjectDTO(project: LeanProject): ProjectDTO {
  return {
    id: project._id.toString(),
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    techStack: [...project.techStack],
    coverImage: project.coverImage,
    images: [...project.images],
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    featured: project.featured,
    order: project.order,
    status: project.status,
    category: project.category,
    year: project.year,
    createdAt: new Date(project.createdAt).toISOString(),
    updatedAt: new Date(project.updatedAt).toISOString(),
  };
}

export function toMessageDTO(message: LeanMessage): ContactMessageDTO {
  return {
    id: message._id.toString(),
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    read: message.read,
    createdAt: new Date(message.createdAt).toISOString(),
  };
}

export function toSiteConfigDTO(config: LeanSiteConfig): SiteConfigDTO {
  return {
    name: config.name,
    shortName: config.shortName,
    role: config.role,
    tagline: config.tagline,
    heroTitle: config.heroTitle,
    heroAccent: config.heroAccent,
    summary: config.summary,
    location: config.location,
    email: config.email,
    phone: config.phone,
    profileImage: config.profileImage,
    resumeUrl: config.resumeUrl,
    availability: config.availability,
    socials: {
      github: config.socials?.github ?? "",
      linkedin: config.socials?.linkedin ?? "",
      portfolio: config.socials?.portfolio ?? "",
    },
    updatedAt: new Date(config.updatedAt).toISOString(),
  };
}
