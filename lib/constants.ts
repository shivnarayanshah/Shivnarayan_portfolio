import type {
  EducationItem,
  ExperienceItem,
  SkillGroup,
  TrainingItem,
} from "@/lib/types";

export const NAV_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
] as const;

export const SKILL_MARQUEE = [
  "Next.js",
  "React.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "Tailwind CSS",
  "REST APIs",
  "Authentication",
  "VPS / Linux",
  "Vercel",
  "Git & GitHub",
  "Performance",
  "Accessibility",
] as const;

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend engineering",
    description:
      "Interfaces that are fast, accessible, and considered down to the last interaction.",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
      "Responsive design",
      "Flexbox & Grid",
    ],
  },
  {
    title: "Backend & data",
    description:
      "APIs and data models built for real business workflows, not just demos.",
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Authentication",
      "Authorization",
      "MongoDB",
      "Mongoose",
      "Server actions",
      "Validation",
    ],
  },
  {
    title: "Delivery & operations",
    description:
      "I ship, secure, and maintain what I build — from DNS to deployments.",
    skills: [
      "VPS",
      "Linux",
      "Vercel",
      "Render",
      "Git",
      "GitHub",
      "Domain & DNS",
      "Performance optimization",
      "Debugging",
    ],
  },
  {
    title: "Product craft",
    description:
      "The details that turn a working app into something people trust and enjoy.",
    skills: [
      "Modern UI/UX",
      "Accessibility",
      "API integration",
      "Business workflows",
      "Admin systems",
      "Full-stack ownership",
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Full-Stack Developer",
    company: "ByaparHouse",
    period: "Current",
    location: "Kathmandu, Nepal",
    current: true,
    summary:
      "Building and maintaining a business-focused platform and its supporting web applications, end to end.",
    highlights: [
      "Develop React and Next.js interfaces backed by Node.js APIs and MongoDB.",
      "Own authentication, authorization, admin systems, and day-to-day business workflows.",
      "Deploy and maintain production services across VPS infrastructure, domains, and DNS.",
      "Work directly with the product side to turn operational needs into reliable software.",
    ],
    links: [
      { label: "byaparhouse.com", href: "https://byaparhouse.com" },
      { label: "jobs.byaparhouse.com", href: "https://jobs.byaparhouse.com" },
      {
        label: "backoffice.byaparhouse.com",
        href: "https://backoffice.byaparhouse.com",
      },
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    qualification: "Diploma in Computer Engineering",
    institution: "Kathmandu Institute of Technology",
    period: "Computer Engineering",
    detail:
      "A foundation in software fundamentals, systems, networking, and applied computing.",
  },
  {
    qualification: "SLC",
    institution: "Shree Shiva Shakti Higher Secondary School, Bateshwor",
    period: "School Leaving Certificate",
    detail:
      "Completed secondary education before moving into computer engineering.",
  },
];

export const TRAINING: TrainingItem[] = [
  {
    title: "MERN Stack Training",
    provider: "MindRisers Technology",
    period: "2025",
    detail:
      "An intensive, project-led program covering the full MERN stack and the craft around it.",
    topics: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "HTML",
      "Flexbox & Grid",
      "Accessibility",
      "Debugging",
      "Vercel",
      "Render",
    ],
  },
];

export const PRINCIPLES = [
  {
    number: "01",
    title: "Own the whole path",
    body: "From schema design and API contracts to the final focus state. Fewer handoffs, fewer gaps.",
  },
  {
    number: "02",
    title: "Build for the real world",
    body: "Production traffic, imperfect data, slow networks, and the people who use the product every day.",
  },
  {
    number: "03",
    title: "Make it feel effortless",
    body: "Performance and clarity are features. The best interface is the one nobody has to think about.",
  },
];

export const STATS = [
  { value: 6, suffix: "+", label: "Projects shipped" },
  { value: 3, suffix: "", label: "Live business apps" },
  { value: 100, suffix: "%", label: "End-to-end ownership" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Projects", href: "/admin/projects", icon: "FolderKanban" },
  { label: "Messages", href: "/admin/messages", icon: "Inbox" },
  { label: "Site settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const PROJECT_CATEGORIES = [
  "Platform",
  "Business",
  "Healthcare",
  "Portfolio",
  "Entertainment",
] as const;
