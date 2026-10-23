export type ProjectStatus = "published" | "draft";

export interface ProjectDTO {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfigDTO {
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
  updatedAt?: string;
}

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalMessages: number;
  unreadMessages: number;
  recentProjects: ProjectDTO[];
  recentMessages: ContactMessageDTO[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ActionResult<T = null> =
  | { success: true; data: T; message?: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export interface SkillGroup {
  title: string;
  description: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  links?: { label: string; href: string }[];
  current?: boolean;
}

export interface EducationItem {
  qualification: string;
  institution: string;
  period: string;
  detail: string;
}

export interface TrainingItem {
  title: string;
  provider: string;
  period: string;
  detail: string;
  topics: string[];
}
