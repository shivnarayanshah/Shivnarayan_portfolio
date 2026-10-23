"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Inbox,
  Mail,
  MailOpen,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  deleteMessage as deleteMessageAction,
  toggleMessageRead,
} from "@/lib/actions/messages";
import type { ContactMessageDTO } from "@/lib/types";
import { cn, formatDate, formatRelativeDate } from "@/lib/utils";

export function MessagesList({ messages }: { messages: ContactMessageDTO[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageDTO | null>(
    null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const active = messages.find((message) => message.id === activeId) ?? null;
  const unreadCount = messages.filter((message) => !message.read).length;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return messages.filter((message) => {
      if (filter === "unread" && message.read) return false;
      if (!term) return true;
      return [message.name, message.email, message.subject, message.message]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [filter, messages, query]);

  async function toggleRead(message: ContactMessageDTO) {
    setBusyId(message.id);
    const result = await toggleMessageRead(message.id);
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message ?? "Message updated.");
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    const result = await deleteMessageAction(deleteTarget.id);
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(result.message ?? "Message deleted.");
    if (activeId === deleteTarget.id) setActiveId(null);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/30 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/40 p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.68rem] font-medium transition-colors",
              filter === "all"
                ? "bg-ink text-bg"
                : "text-muted hover:text-ink",
            )}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.68rem] font-medium transition-colors",
              filter === "unread"
                ? "bg-ink text-bg"
                : "text-muted hover:text-ink",
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <label className="relative flex w-full items-center sm:max-w-xs">
          <span className="sr-only">Search messages</span>
          <Search className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, subject…"
            className="field h-10 pl-9 text-xs"
          />
        </label>
      </div>

      {filtered.length ? (
        <ul className="space-y-2">
          {filtered.map((message) => (
            <li key={message.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setActiveId(message.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveId(message.id);
                  }
                }}
                className={cn(
                  "group flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface/30 p-4 transition-colors hover:bg-surface/60 sm:gap-4",
                  !message.read && "border-accent/20 bg-accent/[0.035]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                    message.read
                      ? "border-line bg-surface text-muted"
                      : "border-accent/25 bg-accent/10 text-accent",
                  )}
                >
                  {message.read ? (
                    <MailOpen className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.8rem] font-medium text-ink">
                      {message.name}
                    </p>
                    {!message.read ? (
                      <Badge variant="accent">New</Badge>
                    ) : null}
                    <span className="ml-auto shrink-0 text-[0.62rem] text-muted">
                      {formatRelativeDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[0.72rem] text-muted">
                    {message.email}
                  </p>
                  <p className="mt-1.5 truncate text-[0.75rem] font-medium text-ink-soft">
                    {message.subject}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[0.68rem] text-muted">
                    {message.message}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void toggleRead(message);
                    }}
                    disabled={busyId === message.id}
                    aria-label={
                      message.read ? "Mark as unread" : "Mark as read"
                    }
                    title={message.read ? "Mark as unread" : "Mark as read"}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleteTarget(message);
                    }}
                    aria-label="Delete message"
                    title="Delete message"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface/20 px-6 py-20 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="mt-4 font-display text-2xl text-ink">
            {messages.length ? "No matching messages." : "The inbox is empty."}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            {messages.length
              ? "Try a different search term or switch back to all messages."
              : "Messages sent through the contact form will appear here."}
          </p>
        </div>
      )}

      <Modal
        open={Boolean(active)}
        onClose={() => setActiveId(null)}
        title={active?.subject ?? "Message"}
        description={
          active
            ? `From ${active.name} · ${active.email} · ${formatDate(active.createdAt)}`
            : undefined
        }
        size="lg"
        footer={
          active ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteTarget(active)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void toggleRead(active)}
                loading={busyId === active.id}
              >
                {active.read ? "Mark as unread" : "Mark as read"}
              </Button>
              <Button type="button" onClick={() => setActiveId(null)}>
                Close
              </Button>
            </>
          ) : undefined
        }
      >
        {active ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={active.read ? "outline" : "accent"}>
                {active.read ? "Read" : "Unread"}
              </Badge>
              <a
                href={`mailto:${active.email}?subject=${encodeURIComponent(
                  `Re: ${active.subject}`,
                )}`}
                className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[0.65rem] font-medium text-accent"
              >
                Reply by email
              </a>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {active.message}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this message?"
        description={
          deleteTarget
            ? `“${deleteTarget.subject}” from ${deleteTarget.name} will be permanently removed.`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={busyId === deleteTarget?.id}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={confirmDelete}
              loading={busyId === deleteTarget?.id}
            >
              Delete message
            </Button>
          </>
        }
      >
        <p className="text-xs leading-relaxed text-muted">
          This cannot be undone. The sender&apos;s details will be removed from
          the database.
        </p>
      </Modal>
    </>
  );
}
