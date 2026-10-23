"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

const statuses = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

export function ProjectToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");

  function apply(nextQuery: string, nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    else params.delete("q");
    if (nextStatus !== "all") params.set("status", nextStatus);
    else params.delete("status");
    params.delete("page");

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/30 p-3 sm:flex-row sm:items-center sm:justify-between">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          apply(query, status);
        }}
        className="relative flex flex-1 items-center"
        role="search"
      >
        <Search className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, category, tech…"
          aria-label="Search projects"
          className="field h-10 pl-9 pr-16 text-xs"
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                apply("", status);
              }}
              aria-label="Clear search"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-7 items-center rounded-full bg-ink px-2.5 text-[0.65rem] font-medium text-bg"
          >
            Go
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            apply(query, event.target.value);
          }}
          className={cn(
            "field h-10 w-full text-xs sm:w-40",
            pending && "opacity-70",
          )}
        >
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted" aria-hidden />
        ) : null}
      </div>
    </div>
  );
}
