"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MapPin } from "lucide-react";

import type { SiteConfigDTO } from "@/lib/types";

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDUiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNlOGUwZDIiLz48L3N2Zz4=";

export function ProfilePortrait({
  config,
}: {
  config: Pick<SiteConfigDTO, "name" | "profileImage" | "location" | "role">;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(rawRotateY, { stiffness: 160, damping: 18 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(x * 10);
    rawRotateX.set(y * -8);
  }

  function onPointerLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[24rem] sm:max-w-[27rem] lg:max-w-[30rem]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-hero-portrait
    >
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_68%)] blur-2xl"
      />
      <div className="portrait-shell">
        <div className="portrait-ring" aria-hidden />
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          className="portrait-mask relative aspect-[4/5] border border-white/25 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.65)]"
        >
          <Image
            src={config.profileImage || "/images/profile.png"}
            alt={`Portrait of ${config.name}`}
            fill
            priority
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 27rem, 30rem"
            className="object-cover object-[50%_18%] saturate-[0.92] transition-transform duration-700 hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/70">
                {config.role}
              </p>
              <p className="mt-1 font-display text-xl leading-none">
                {config.name}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[0.6rem] backdrop-blur-md">
              <MapPin className="h-3 w-3" />
              Kathmandu
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-4 top-8 hidden rounded-2xl border border-line bg-[var(--card)] px-3.5 py-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
          </span>
          <p className="text-[0.65rem] font-medium text-ink">Available for work</p>
        </div>
        <p className="mt-1 text-[0.6rem] text-muted">Full-time & freelance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-5 -right-2 hidden w-44 rounded-2xl border border-line bg-[var(--card)] p-3.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:block"
      >
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted">
          Currently building with
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Next.js", "TypeScript", "MongoDB"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-line bg-surface/60 px-2 py-1 text-[0.6rem] text-ink-soft"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
