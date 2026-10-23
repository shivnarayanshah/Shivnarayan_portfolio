import { SKILL_MARQUEE } from "@/lib/constants";

export function SkillsMarquee() {
  return (
    <section
      aria-label="Technologies and skills"
      className="border-y border-line bg-surface/30 py-5"
    >
      <div className="marquee">
        <div className="marquee-track items-center gap-8">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-8 pr-8"
            >
              {SKILL_MARQUEE.map((skill) => (
                <li
                  key={`${copy}-${skill}`}
                  className="flex items-center gap-8 whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted"
                >
                  {skill}
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-accent/60"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
