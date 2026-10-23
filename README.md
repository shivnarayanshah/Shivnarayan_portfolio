# ShivNarayan Sah — Portfolio

A production-grade, database-driven portfolio for **ShivNarayan Sah**, a full-stack developer in Kathmandu, Nepal.

The public site is built with the Next.js App Router, React Server Components, TypeScript, Tailwind CSS v4, MongoDB/Mongoose, GSAP, Framer Motion, and Lenis. Projects and site copy are managed through a protected admin area with a Tiptap editor, Cloudinary uploads, drag-and-drop ordering, typed server actions, and Zod validation.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `16.4.2` (App Router, React `19.2.3`) |
| Language | TypeScript `5.9` |
| Styling | Tailwind CSS v4 + custom design tokens |
| Database | MongoDB Atlas + Mongoose `8.24` |
| Auth | Custom JWT sessions (`jose`), httpOnly cookie, `bcryptjs` |
| Uploads | Cloudinary (protected API route) |
| Editor | Tiptap v3 |
| Forms | Formik + Yup (client), Zod (server) |
| Motion | GSAP + ScrollTrigger, Framer Motion, Lenis |
| Email | Resend (optional, best-effort) |
| Toasts | Sonner |

### Pragmatic choices

- **Auth:** a single admin account, JWT in an httpOnly cookie, optimistic route protection in `proxy.ts`, and real authorization checks inside every server action. No third-party auth provider is required.
- **Uploads:** a protected `/api/admin/upload` route streams images to Cloudinary. Images can also be added by URL if Cloudinary is not configured.
- **Editor:** Tiptap with StarterKit and Placeholder. HTML is sanitized with `sanitize-html` before it is rendered publicly.
- **Fallback content:** if MongoDB is unreachable, the public site renders the static CV/project content in `lib/data/fallback.ts` instead of failing. Admin routes require a working database.

---

## Features

### Public site

- Cream/editorial light theme and full dark theme, persisted with `next-themes` (`storageKey="sn-theme"`) with no flash.
- Glass navigation, backdrop blur, grain overlay, gradient orbs, custom cursor, scroll progress.
- GSAP hero timeline, ScrollTrigger reveals, Lenis smooth scroll, magnetic buttons, tilt cards, animated counters, marquee, reduced-motion support.
- Server Components by default, Suspense-friendly loading UI, `next/image`, `next/font`, dynamic imports for animation/editor bundles.
- Project index with category filters and search, project case-study pages with sanitized rich text, gallery lightbox, related work, and JSON-LD.
- Contact form with honeypot, rate limiting, MongoDB storage, optional Resend email, and Sonner feedback.
- SEO: metadata API, canonical URLs, Open Graph/Twitter images, dynamic project metadata, `sitemap.xml`, `robots.txt`, web manifest, JSON-LD.
- Admin loading skeletons, error boundaries, and a designed 404 with a real 404 status.

### Admin

- `/admin/login` — JWT session login with rate limiting.
- `/admin/dashboard` — project/message stats, recent activity, quick actions.
- `/admin/projects` — search, status filter, pagination, publish toggle, delete confirmation.
- `/admin/projects/new` and `/admin/projects/[id]/edit` — Formik/Yup form, auto-slug, Tiptap case study, tag input, cover/gallery uploads, publish controls.
- `/admin/projects/reorder` — dnd-kit drag-and-drop ordering, keyboard accessible.
- `/admin/messages` — inbox, read/unread, search, detail view, delete.
- `/admin/settings` — site identity, hero copy, contact details, social links, profile image.

Every mutation:

1. Verifies the session **and** the admin user in the database.
2. Validates input with Zod.
3. Writes to MongoDB.
4. Calls `updateTag(...)` for immediate cache expiry plus `revalidatePath(...)` for affected routes.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in at minimum:

```env
MONGO_URI=mongodb+srv://…
AUTH_SECRET=…          # openssl rand -base64 48
ADMIN_EMAIL=…
ADMIN_PASSWORD=…       # 8+ characters, use a strong one
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Cloudinary and Resend are optional. Uploads return a clear error until Cloudinary is configured; pasted image URLs still work.

### 3. Seed the database

```bash
npm run seed          # upsert site config, admin user, and six projects
npm run seed -- --reset  # replace existing projects with the seed set
```

The seed creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Do not leave those values as the example values in production.

> **MongoDB Atlas:** if seeding fails with `bad auth : authentication failed`, the database user/password in `MONGO_URI` is wrong. If it times out, add your current IP under **Atlas → Network Access**.

### 4. Run

```bash
npm run dev
```

- Public: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`
- Sign in with the seeded admin credentials.

### Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm start          # production server
npm run typecheck  # tsc --noEmit
npm run seed       # seed MongoDB
```

---

## Project structure

```text
app/
├── (site)/                     # public site (navbar/footer/smooth scroll shell)
│   ├── page.tsx                # home
│   ├── projects/page.tsx       # project index
│   ├── projects/[slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── admin/
│   ├── layout.tsx              # noindex admin root
│   ├── page.tsx                # redirect → dashboard
│   ├── login/page.tsx
│   └── (protected)/
│       ├── layout.tsx          # requireAdmin + AdminShell
│       ├── dashboard/page.tsx
│       ├── projects/page.tsx
│       ├── projects/new/page.tsx
│       ├── projects/[id]/edit/page.tsx
│       ├── projects/reorder/page.tsx
│       ├── messages/page.tsx
│       ├── settings/page.tsx
│       ├── loading.tsx
│       └── error.tsx
├── api/
│   ├── admin/upload/route.ts   # Cloudinary upload (protected)
│   ├── og/route.tsx            # dynamic Open Graph image
│   └── revalidate/route.ts     # external tag revalidation
├── layout.tsx                  # fonts, metadata, theme, Toaster
├── globals.css                 # design tokens, utilities, prose/Tiptap/Lenis
├── manifest.ts
├── robots.ts
├── sitemap.ts
└── icon.svg

components/
├── admin/                      # shell, forms, editor, uploads, tables, DnD
├── site/                       # hero, sections, navbar, footer, project UI
└── ui/                         # button, input, modal, theme toggle, motion primitives

lib/
├── actions/                    # typed server actions
├── auth/                       # token, session, DAL, rate limit
├── data/                       # cached public reads + admin queries + fallbacks
├── validations/                # Zod + Yup schemas
├── db.ts                       # cached Mongoose connection
├── cloudinary.ts
├── email.ts
├── sanitize.ts
├── types.ts
└── utils.ts

models/                         # Project, User, ContactMessage, SiteConfig
scripts/seed.ts
proxy.ts                        # Next 16 route protection
```

---

## Data model

`Project`:

```ts
{
  title, slug, shortDescription, longDescription,
  techStack: string[], coverImage, images: string[],
  liveUrl, repoUrl, featured, order,
  status: "published" | "draft",
  category, year, createdAt, updatedAt
}
```

`SiteConfig` stores the hero/profile/contact content. `ContactMessage` stores enquiries. `User` stores the bcrypt password hash and admin role.

Public reads are wrapped in `unstable_cache` with the tags `projects` and `site-config` and a one-hour revalidate window. Admin mutations call `updateTag` (Next 16) so editors see their changes immediately, and `revalidatePath` for the affected pages.

---

## Performance notes

- **Server Components by default.** Client boundaries are limited to interactive pieces (navbar, forms, editor, motion, uploaders, DnD).
- **Static-first public pages** with ISR; admin pages are dynamic because they depend on session cookies and live data, with a loading skeleton inside the protected layout. Keeping the public route group free of a top-level `loading.tsx` lets `notFound()` return a true 404 instead of a streamed 200.
- **Images:** `next/image` with responsive `sizes`, AVIF/WebP formats, priority only on the hero portrait, and long `minimumCacheTTL`. Local SVG covers are served `unoptimized`.
- **Fonts:** `next/font/google` with `display: swap` and CSS variables.
- **Heavy libraries:** GSAP/ScrollTrigger and Lenis are dynamically imported inside effects; Tiptap is dynamically imported in the admin form with `ssr: false`.
- **Caching:** tag-based `unstable_cache`, ISR (`revalidate = 3600`) on public pages, and targeted invalidation on writes.
- **Package imports:** `optimizePackageImports` for lucide, framer-motion, and Tiptap.
- **Reduced motion:** Lenis, GSAP reveals, custom cursor, tilt, and counters all respect `prefers-reduced-motion`.
- **Database:** a cached connection with a short failure cooldown prevents every render from paying a connection timeout.

## Deployment notes

### Vercel (recommended)

1. Push the repository and import it into Vercel.
2. Add all environment variables from `.env.example` (use production values).
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
4. In MongoDB Atlas, allow Vercel egress IPs (`0.0.0.0/0` is the pragmatic option if you do not have static egress).
5. Seed once from your machine with production credentials:
   ```bash
   npm run seed
   ```
6. Deploy. Public pages are statically generated with ISR, so seed **before** the first build whenever possible. If you seed an already-running deployment, trigger the project cache refresh once so the new content replaces the fallback pages without waiting for revalidation:
   ```bash
   curl -X POST "https://your-domain.com/api/revalidate?tag=projects" \
     -H "x-revalidate-secret: $REVALIDATE_SECRET"
   ```
   Repeat with `?tag=site-config` after editing site settings outside the admin UI.

### Any Node host / VPS

```bash
npm ci
npm run build
npm start        # or run behind pm2/nginx
```

Use a process manager, terminate TLS at a reverse proxy, and keep `.env.local` out of version control. Set `AUTH_SECRET` to a long random value; production sessions fail closed without it.

### External revalidation

If content changes outside the admin UI (for example a migration script), trigger:

```bash
curl -X POST "https://your-domain.com/api/revalidate?tag=projects" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET"
```

Allowed tags: `projects`, `site-config`.

---

## Security notes

- Session cookie is `httpOnly`, `sameSite=lax`, `secure` in production, 7-day expiry.
- `proxy.ts` provides optimistic route protection; **server actions re-check the session and the database user** — proxy alone is never trusted.
- Login and contact submissions are rate-limited in memory per instance. For multi-instance deployments, swap `lib/auth/rate-limit.ts` for Redis/Upstash.
- All project/site inputs are validated with Zod server-side, in addition to Yup on the client.
- Uploads are restricted to JPG/PNG/WebP/AVIF, 4 MB per file, 4 files per request, and admin-only.
- Project HTML is sanitized before rendering.
- Admin pages are `noindex, nofollow`; `robots.ts` disallows `/admin` and `/api`.
- Security headers are configured in `next.config.ts`.

---

## Content editing workflow

1. Sign in at `/admin/login`.
2. Create a project in **Projects → New project**.
3. Add a cover, summary, case study, stack, links, and publish status.
4. Use **Reorder** to set the public order.
5. Edit **Site settings** for the hero, profile image, contact details, and social links.
6. Check **Messages** for enquiries.

New projects default to **Draft**. Publishing immediately revalidates the home page, project index, sitemap, and the project page.

---

## Troubleshooting

| Symptom | Likely fix |
| --- | --- |
| `bad auth : authentication failed` | Database username/password in `MONGO_URI` is wrong; URL-encode special characters. |
| Connection timeout | Add your IP in Atlas → Network Access; check the cluster hostname. |
| Login says invalid credentials | Run `npm run seed` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then sign in again. |
| Uploads disabled | Add the three `CLOUDINARY_*` values. |
| Contact email not sent | `RESEND_API_KEY` missing or sender not verified. Messages are still stored. |
| Public site shows seed content | MongoDB is unreachable or has no projects; the fallback is intentional. |
| Theme flashes | Ensure `ThemeProvider` remains in `app/layout.tsx` and `suppressHydrationWarning` stays on `<html>`. |

---

## License

Personal portfolio content and images belong to ShivNarayan Sah. Code is available for reference; please do not republish the personal content as your own.
