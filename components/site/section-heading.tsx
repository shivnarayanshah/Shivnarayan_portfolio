import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div
        className={cn("max-w-2xl", align === "center" && "mx-auto")}
        data-reveal
      >
        {eyebrow ? (
          <p className="mb-4 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted">
            <span className="h-px w-7 bg-accent/60" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-[clamp(2.3rem,1.7rem+2.4vw,4rem)] leading-[0.98] tracking-[-0.025em] text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="shrink-0" data-reveal data-reveal-delay="0.1">
          {action}
        </div>
      ) : null}
    </div>
  );
}
