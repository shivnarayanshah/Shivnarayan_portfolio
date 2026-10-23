import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "sage" | "gold" | "outline" | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "border-line bg-surface-muted/70 text-ink-soft",
  accent: "border-accent/25 bg-accent/10 text-accent",
  sage: "border-sage/25 bg-sage/10 text-sage",
  gold: "border-gold/30 bg-gold/10 text-gold",
  outline: "border-line-strong bg-transparent text-muted",
  danger: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-none tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
