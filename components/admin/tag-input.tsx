"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

const suggestions = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "Tailwind CSS",
  "REST APIs",
  "GSAP",
  "Framer Motion",
  "Cloudinary",
  "Vercel",
  "VPS",
  "PostgreSQL",
  "Prisma",
];

export function TagInput({
  value,
  onChange,
  label = "Tech stack",
  placeholder = "Type a technology and press Enter",
  error,
  max = 24,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  max?: number;
}) {
  const [input, setInput] = useState("");

  const available = useMemo(() => {
    const selected = new Set(value.map((item) => item.toLowerCase()));
    return suggestions
      .filter((item) => !selected.has(item.toLowerCase()))
      .filter((item) => item.toLowerCase().includes(input.trim().toLowerCase()))
      .slice(0, 6);
  }, [input, value]);

  function add(raw: string) {
    const item = raw.trim().replace(/,$/, "");
    if (!item) return;
    if (value.length >= max) return;
    if (value.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
      setInput("");
      return;
    }
    onChange([...value, item]);
    setInput("");
  }

  function remove(item: string) {
    onChange(value.filter((existing) => existing !== item));
  }

  return (
    <div>
      <div className="field-label">
        <span>{label}</span>
        <span className="text-[0.62rem] font-normal text-muted">
          {value.length}/{max}
        </span>
      </div>

      <div
        className={cn(
          "rounded-xl border border-line bg-surface/50 p-2 transition-colors focus-within:border-accent/50",
          error && "border-red-500/60",
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[0.68rem] text-ink-soft"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                className="text-muted transition-colors hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <div className="flex min-w-[10rem] flex-1 items-center gap-1">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  add(input);
                }
                if (event.key === "Backspace" && !input && value.length) {
                  remove(value[value.length - 1]);
                }
              }}
              onBlur={() => {
                if (input.trim()) add(input);
              }}
              placeholder={value.length ? "Add another…" : placeholder}
              aria-label={label}
              className="min-w-0 flex-1 bg-transparent px-1 py-1 text-xs text-ink outline-none placeholder:text-muted/70"
            />
            <button
              type="button"
              onClick={() => add(input)}
              disabled={!input.trim() || value.length >= max}
              aria-label="Add technology"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {available.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {available.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => add(item)}
              className="rounded-full border border-dashed border-line px-2 py-0.5 text-[0.6rem] text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              + {item}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
