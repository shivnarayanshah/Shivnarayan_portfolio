"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {label || description ? (
        <div className="min-w-0">
          {label ? (
            <p className="text-sm font-medium text-ink">{label}</p>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? "Toggle"}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300",
          checked
            ? "border-accent bg-accent"
            : "border-line-strong bg-surface-muted",
          disabled && "opacity-50",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300",
            checked ? "translate-x-[1.4rem]" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
