"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";

import { Modal } from "@/components/ui/modal";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const activeImage = active === null ? null : images[active];

  if (!images.length) return null;

  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Gallery
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">
            Selected frames
          </h2>
        </div>
        <p className="text-[0.68rem] text-muted">{images.length} images</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-muted text-left"
            aria-label={`Open ${title} image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} — image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
              unoptimized={image.endsWith(".svg")}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
              <Expand className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={`${title} — image ${active === null ? "" : active + 1}`}
        size="lg"
      >
        {activeImage ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-muted">
            <Image
              src={activeImage}
              alt={`${title} — image ${(active ?? 0) + 1}`}
              fill
              sizes="(max-width: 768px) 92vw, 60rem"
              unoptimized={activeImage.endsWith(".svg")}
              className="object-contain"
            />
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
