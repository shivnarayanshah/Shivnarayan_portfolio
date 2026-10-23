import type { ProjectDTO, SiteConfigDTO } from "@/lib/types";

const now = "2026-09-18T08:00:00.000Z";

export const FALLBACK_SITE_CONFIG: SiteConfigDTO = {
  name: "ShivNarayan Sah",
  shortName: "ShivNarayan",
  role: "Full-Stack Developer",
  tagline: "MERN stack · React · Next.js",
  heroTitle: "I build web products that feel as good as they work.",
  heroAccent: "feel as good as they work.",
  summary:
    "Full-stack developer from Kathmandu, building responsive, scalable, production-ready applications with React, Next.js, Node.js, and MongoDB. I work across the entire product path — interface, API, database, deployment, and the details in between.",
  location: "Kathmandu, Tokha, Nepal",
  email: "shivnarayan2072@gmail.com",
  phone: "+977 9819655982",
  profileImage: "/images/profile.png",
  resumeUrl: "/shivnarayan.pdf",
  availability: "Open to full-time roles & select freelance work",
  socials: {
    github: "https://github.com/shivnarayanshah",
    linkedin: "",
    portfolio: "https://shivnarayan.com.np",
  },
  updatedAt: now,
};

export const FALLBACK_PROJECTS: ProjectDTO[] = [
  {
    id: "fallback-byaparhouse",
    title: "ByaparHouse",
    slug: "byaparhouse",
    shortDescription:
      "A business-focused platform and its ecosystem of job, back-office, and operations applications.",
    longDescription: `
      <h2>A connected platform for real business operations</h2>
      <p>ByaparHouse is a business-focused full-stack platform supported by a family of web applications — including a public business site, a dedicated jobs portal, and a back-office system for internal operations.</p>
      <p>I work across the stack: React and Next.js on the frontend, Node.js APIs and MongoDB on the backend, with authentication, admin workflows, and production infrastructure tying it all together.</p>
      <h2>What I owned</h2>
      <ul>
        <li>Designed and built responsive interfaces for the public site, jobs portal, and back-office.</li>
        <li>Implemented API integration, authentication, authorization, and business workflows.</li>
        <li>Managed production deployments, domains, DNS, and ongoing maintenance on VPS infrastructure.</li>
        <li>Worked directly with stakeholders to translate operational requirements into software.</li>
      </ul>
      <p>The result is a set of applications that support daily business activity rather than a static marketing presence — built to be maintained, extended, and relied on.</p>
    `,
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Tailwind CSS", "VPS"],
    coverImage: "/images/projects/byaparhouse.svg",
    images: [],
    liveUrl: "https://byaparhouse.com",
    repoUrl: "",
    featured: true,
    order: 1,
    status: "published",
    category: "Platform",
    year: 2026,
    createdAt: "2025-02-12T09:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "fallback-trinayana",
    title: "Trinayana Solution",
    slug: "trinayana-solution",
    shortDescription:
      "A polished digital home for a technology solutions company, built for clarity and credibility.",
    longDescription: `
      <h2>A clear story for a solutions business</h2>
      <p>Trinayana Solution needed a web presence that communicated its services with confidence. I designed and built a fast, responsive marketing site with a clean content structure, strong typography, and a straightforward path to enquiry.</p>
      <h2>Highlights</h2>
      <ul>
        <li>Responsive Next.js frontend with Tailwind CSS and reusable content sections.</li>
        <li>Node.js and MongoDB-backed content and contact workflow.</li>
        <li>SEO-aware structure, accessible components, and optimized loading.</li>
        <li>Deployment, domain configuration, and post-launch maintenance.</li>
      </ul>
      <p>The site gives the team a professional foundation they can grow without fighting the codebase.</p>
    `,
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB"],
    coverImage: "/images/projects/trinayana.svg",
    images: [],
    liveUrl: "https://trinayanasolution.com.np",
    repoUrl: "",
    featured: true,
    order: 2,
    status: "published",
    category: "Business",
    year: 2025,
    createdAt: "2025-05-04T09:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "fallback-jalpa-dental",
    title: "Jalpa Dental",
    slug: "jalpa-dental",
    shortDescription:
      "A calm, modern dental clinic website focused on trust, services, and easy appointment enquiries.",
    longDescription: `
      <h2>Making a clinic feel welcoming online</h2>
      <p>Jalpa Dental needed more than a brochure. The site introduces the clinic, explains treatments clearly, and makes it simple for patients to get in touch — all within a calm visual language that reflects the care experience.</p>
      <h2>What was built</h2>
      <ul>
        <li>A responsive Next.js site with a clear service hierarchy and approachable visual design.</li>
        <li>Contact and appointment enquiry flows connected to the backend.</li>
        <li>Accessible navigation, sensible content structure, and mobile-first layouts.</li>
        <li>Production deployment and ongoing upkeep.</li>
      </ul>
    `,
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB"],
    coverImage: "/images/projects/jalpa-dental.svg",
    images: [],
    liveUrl: "https://jalpadental.com.np",
    repoUrl: "",
    featured: true,
    order: 3,
    status: "published",
    category: "Healthcare",
    year: 2025,
    createdAt: "2025-07-16T09:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "fallback-hamro-dental",
    title: "Hamro Dental",
    slug: "hamro-dental",
    shortDescription:
      "A friendly dental practice website built to turn local searches into confident patient enquiries.",
    longDescription: `
      <h2>Local care, presented with clarity</h2>
      <p>Hamro Dental needed a site that felt human and dependable. I built a mobile-first experience that puts services, location, and contact details within easy reach, supported by a lightweight backend for enquiries.</p>
      <h2>Highlights</h2>
      <ul>
        <li>Modern, responsive interface with accessible components.</li>
        <li>Service content structured for scanning and search visibility.</li>
        <li>Enquiry handling backed by Node.js and MongoDB.</li>
        <li>Deployment, DNS, and maintenance handled end to end.</li>
      </ul>
    `,
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB"],
    coverImage: "/images/projects/hamro-dental.svg",
    images: [],
    liveUrl: "https://hamrodental.com.np",
    repoUrl: "",
    featured: true,
    order: 4,
    status: "published",
    category: "Healthcare",
    year: 2025,
    createdAt: "2025-09-02T09:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "fallback-portfolio",
    title: "Personal Portfolio",
    slug: "personal-portfolio",
    shortDescription:
      "The site you are looking at: a database-driven, admin-managed portfolio with motion and a custom design system.",
    longDescription: `
      <h2>A portfolio that behaves like a product</h2>
      <p>This portfolio started as a static page and was rebuilt as a production-grade application. Projects live in MongoDB, content is managed through a protected admin panel, and the public experience is designed around speed, accessibility, and considered motion.</p>
      <h2>Engineering notes</h2>
      <ul>
        <li>Next.js App Router with Server Components by default and streaming where it helps.</li>
        <li>MongoDB and Mongoose behind cached data access with tag-based revalidation.</li>
        <li>Custom JWT session auth, server-side authorization on every mutation, and Zod validation.</li>
        <li>GSAP, Framer Motion, and Lenis layered carefully with reduced-motion support.</li>
        <li>Cloudinary image uploads, a Tiptap editor, drag-and-drop ordering, and typed server actions.</li>
      </ul>
      <p>It is intentionally over-engineered in the places that make the site pleasant to own: content editing, image handling, validation, and deployment.</p>
    `,
    techStack: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
    ],
    coverImage: "/images/projects/portfolio.svg",
    images: [],
    liveUrl: "https://shivnarayan.com.np",
    repoUrl: "",
    featured: false,
    order: 5,
    status: "published",
    category: "Portfolio",
    year: 2026,
    createdAt: "2026-01-08T09:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "fallback-pinky-movie",
    title: "PinkyMovie",
    slug: "pinky-movie",
    shortDescription:
      "A fast, playful movie discovery experience for browsing films without the clutter.",
    longDescription: `
      <h2>Discovery without the noise</h2>
      <p>PinkyMovie is a movie browsing side project built around a simple idea: make finding something to watch feel quick and enjoyable. The interface leans on bold artwork, lightweight interactions, and a layout that works just as well on a phone.</p>
      <h2>Highlights</h2>
      <ul>
        <li>React and Next.js interface with responsive layouts and reusable cards.</li>
        <li>API-driven movie data with graceful loading and error states.</li>
        <li>Deployed on Vercel with a focus on fast first loads.</li>
      </ul>
    `,
    techStack: ["React", "Next.js", "Tailwind CSS", "API integration", "Vercel"],
    coverImage: "/images/projects/pinky-movie.svg",
    images: [],
    liveUrl: "https://pinkymovie.vercel.app",
    repoUrl: "",
    featured: false,
    order: 6,
    status: "published",
    category: "Entertainment",
    year: 2025,
    createdAt: "2025-11-20T09:00:00.000Z",
    updatedAt: now,
  },
];
