import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
  tone?: "default" | "accent" | "sage" | "gold";
}) {
  const tones = {
    default: "bg-surface text-ink",
    accent: "bg-accent/10 text-accent",
    sage: "bg-sage/10 text-sage",
    gold: "bg-gold/10 text-gold",
  } as const;

  return (
    <div className="rounded-2xl border border-line bg-surface/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {label}
          </p>
          <p className="mt-3 font-display text-4xl leading-none tracking-tight text-ink">
            {value}
          </p>
          {hint ? <p className="mt-2 text-[0.68rem] text-muted">{hint}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line",
            tones[tone],
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
