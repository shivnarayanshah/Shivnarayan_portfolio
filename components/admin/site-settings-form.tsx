"use client";

import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { ExternalLink, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteConfig } from "@/lib/actions/site";
import { siteConfigFormSchema } from "@/lib/validations/forms";
import type { SiteConfigDTO } from "@/lib/types";

interface SettingsValues {
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
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface/30">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-[0.68rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SiteSettingsForm({ config }: { config: SiteConfigDTO }) {
  const router = useRouter();

  const initialValues: SettingsValues = {
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
      github: config.socials.github,
      linkedin: config.socials.linkedin,
      portfolio: config.socials.portfolio,
    },
  };

  return (
    <Formik<SettingsValues>
      initialValues={initialValues}
      validationSchema={siteConfigFormSchema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        const result = await updateSiteConfig(values);

        if (!result.success) {
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              if (messages?.[0]) helpers.setFieldError(field, messages[0]);
            }
          }
          helpers.setStatus(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Site settings saved.");
        router.refresh();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        status,
      }) => (
        <Form noValidate className="space-y-6">
          <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-[var(--nav)] px-4 py-3 backdrop-blur-xl lg:top-20">
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted">
                Site configuration
              </p>
              <p className="text-sm font-medium text-ink">
                {values.name} · {values.role}
              </p>
            </div>
            <Button type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving…" : "Save settings"}
            </Button>
          </div>

          {status ? (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-relaxed text-red-600 dark:text-red-400"
            >
              {status}
            </p>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-6">
              <SettingsCard
                title="Identity"
                description="The name and role used across the site, metadata, and footer."
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="name"
                      label="Full name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name ? errors.name : undefined}
                      required
                    />
                    <Input
                      name="shortName"
                      label="Short name"
                      value={values.shortName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.shortName ? errors.shortName : undefined}
                      hint="Used where space is tight."
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="role"
                      label="Role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.role ? errors.role : undefined}
                      required
                    />
                    <Input
                      name="tagline"
                      label="Tagline"
                      value={values.tagline}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.tagline ? errors.tagline : undefined}
                      hint="A short stack or positioning line."
                    />
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Hero"
                description="The first thing visitors read. The accent text is styled in italics."
              >
                <div className="space-y-5">
                  <Input
                    name="heroTitle"
                    label="Hero title"
                    value={values.heroTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.heroTitle ? errors.heroTitle : undefined}
                    hint="Keep it to one or two lines."
                    required
                  />
                  <Input
                    name="heroAccent"
                    label="Accent phrase"
                    value={values.heroAccent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.heroAccent ? errors.heroAccent : undefined}
                    hint="Must be an exact part of the hero title. It will be italicised."
                  />
                  <Textarea
                    name="summary"
                    label="Summary"
                    rows={5}
                    value={values.summary}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.summary ? errors.summary : undefined}
                    hint="Used in the hero, about page, and metadata."
                    required
                  />
                  <Input
                    name="availability"
                    label="Availability"
                    value={values.availability}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.availability ? errors.availability : undefined
                    }
                    hint="Shown in the hero badge and footer."
                  />
                </div>
              </SettingsCard>

              <SettingsCard
                title="Contact details"
                description="Used by the contact page, footer, and enquiry email."
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="email"
                      type="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : undefined}
                      required
                    />
                    <Input
                      name="phone"
                      label="Phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone ? errors.phone : undefined}
                    />
                  </div>
                  <Input
                    name="location"
                    label="Location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.location ? errors.location : undefined}
                  />
                </div>
              </SettingsCard>

              <SettingsCard
                title="Links"
                description="Résumé and social profiles. Empty social links are hidden."
              >
                <div className="space-y-5">
                  <Input
                    name="resumeUrl"
                    label="Résumé URL"
                    value={values.resumeUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.resumeUrl ? errors.resumeUrl : undefined}
                    hint="A path like /shivnarayan.pdf or a full URL."
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      name="socials.github"
                      label="GitHub"
                      placeholder="https://github.com/…"
                      value={values.socials.github}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.socials?.github
                          ? errors.socials?.github
                          : undefined
                      }
                    />
                    <Input
                      name="socials.linkedin"
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/…"
                      value={values.socials.linkedin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.socials?.linkedin
                          ? errors.socials?.linkedin
                          : undefined
                      }
                    />
                    <Input
                      name="socials.portfolio"
                      label="Portfolio / website"
                      placeholder="https://…"
                      value={values.socials.portfolio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.socials?.portfolio
                          ? errors.socials?.portfolio
                          : undefined
                      }
                    />
                  </div>
                </div>
              </SettingsCard>
            </div>

            <aside className="space-y-6">
              <SettingsCard
                title="Profile image"
                description="Used in the hero and about page."
              >
                <ImageUploader
                  value={values.profileImage}
                  onChange={(value) => void setFieldValue("profileImage", value)}
                  label="Portrait"
                  folder="site"
                  aspect="square"
                  hint="A portrait crop works best. JPG, PNG, WebP, or AVIF up to 4 MB."
                  error={
                    touched.profileImage ? errors.profileImage : undefined
                  }
                />
              </SettingsCard>

              <div className="rounded-2xl border border-line bg-surface/20 p-5">
                <p className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  <UserRound className="h-3.5 w-3.5" />
                  Live preview
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-[0.65rem] font-semibold">
                    {values.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-ink">
                      {values.name}
                    </p>
                    <p className="truncate text-[0.62rem] text-muted">
                      {values.role}
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-[0.68rem] leading-relaxed text-muted">
                  {values.summary}
                </p>
                <a
                  href="/"
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-accent"
                >
                  Open home page
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <p className="px-1 text-[0.65rem] leading-relaxed text-muted">
                Changes are saved to MongoDB and revalidate the public pages
                immediately. The fallback content is only used if the database
                is unreachable.
              </p>
            </aside>
          </div>
        </Form>
      )}
    </Formik>
  );
}
