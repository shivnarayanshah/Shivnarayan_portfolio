import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  FileEdit,
  FolderKanban,
  Inbox,
  MailWarning,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

import { AdminPageHeader, StatCard } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/data/projects";
import { formatRelativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const quickActions = [
    {
      label: "New project",
      description: "Add a case study",
      href: "/admin/projects/new",
      icon: Plus,
    },
    {
      label: "Reorder work",
      description: "Set the public order",
      href: "/admin/projects/reorder",
      icon: Sparkles,
    },
    {
      label: "Messages",
      description: `${stats.unreadMessages} unread`,
      href: "/admin/messages",
      icon: Inbox,
    },
    {
      label: "Site settings",
      description: "Hero, profile, links",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A quick read on the portfolio's content and enquiries."
        actions={
          <>
            <Link href="/" target="_blank" className="btn-secondary">
              <Eye className="h-4 w-4" />
              View site
            </Link>
            <Link href="/admin/projects/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              New project
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.totalProjects}
          hint="Everything in the database"
          icon={<FolderKanban className="h-4 w-4" />}
        />
        <StatCard
          label="Published"
          value={stats.publishedProjects}
          hint="Visible on the public site"
          icon={<Eye className="h-4 w-4" />}
          tone="sage"
        />
        <StatCard
          label="Drafts"
          value={stats.draftProjects}
          hint="Work in progress"
          icon={<FileEdit className="h-4 w-4" />}
          tone="gold"
        />
        <StatCard
          label="Unread messages"
          value={stats.unreadMessages}
          hint={`${stats.totalMessages} total enquiries`}
          icon={<MailWarning className="h-4 w-4" />}
          tone="accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface/60"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.78rem] font-medium text-ink">
                  {action.label}
                </span>
                <span className="block text-[0.65rem] text-muted">
                  {action.description}
                </span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-line bg-surface/30">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Recently updated
              </h2>
              <p className="mt-0.5 text-[0.65rem] text-muted">
                Latest project changes
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-accent"
            >
              All projects
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentProjects.length ? (
            <div className="divide-y divide-line">
              {stats.recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}/edit`}
                  className="admin-table-row flex items-center gap-4 px-5 py-3.5"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-muted text-[0.62rem] font-semibold uppercase text-muted">
                    {project.title.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8rem] font-medium text-ink">
                      {project.title}
                    </span>
                    <span className="block truncate text-[0.65rem] text-muted">
                      /{project.slug} · {formatRelativeDate(project.updatedAt)}
                    </span>
                  </span>
                  <Badge
                    variant={project.status === "published" ? "sage" : "outline"}
                  >
                    {project.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-muted">No projects yet.</p>
              <Link
                href="/admin/projects/new"
                className="mt-3 inline-flex text-xs font-medium text-accent"
              >
                Create the first one
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface/30">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">Latest messages</h2>
              <p className="mt-0.5 text-[0.65rem] text-muted">
                From the contact form
              </p>
            </div>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-accent"
            >
              Inbox
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {stats.recentMessages.length ? (
            <div className="divide-y divide-line">
              {stats.recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href="/admin/messages"
                  className="admin-table-row block px-5 py-3.5"
                >
                  <div className="flex items-center gap-2">
                    {!message.read ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    ) : null}
                    <p className="truncate text-[0.78rem] font-medium text-ink">
                      {message.name}
                    </p>
                    <span className="ml-auto shrink-0 text-[0.6rem] text-muted">
                      {formatRelativeDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[0.68rem] text-muted">
                    {message.subject}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-muted">No messages yet.</p>
              <p className="mt-1 text-[0.68rem] text-muted">
                Enquiries will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
