import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "border border-accent/80 bg-accent text-accent-ink shadow-[0_12px_30px_-16px_color-mix(in_srgb,var(--accent)_65%,transparent)] hover:bg-accent-strong hover:-translate-y-0.5",
  secondary:
    "border border-line-strong bg-surface/50 text-ink hover:bg-surface hover:-translate-y-0.5",
  ghost: "border border-transparent text-ink-soft hover:bg-surface-muted/70",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400",
  outline:
    "border border-line-strong bg-transparent text-ink hover:border-accent/40 hover:bg-surface/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-full px-3.5 text-xs gap-1.5",
  md: "h-11 rounded-full px-5 text-[0.8125rem] gap-2",
  lg: "h-12 rounded-full px-6 text-sm gap-2",
  icon: "h-9 w-9 rounded-full p-0",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex select-none items-center justify-center font-semibold leading-none transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
