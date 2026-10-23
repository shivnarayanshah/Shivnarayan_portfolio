"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] render error", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-32 text-center">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">
        Something went wrong
      </p>
      <h1 className="mt-5 font-display text-4xl tracking-tight text-ink sm:text-5xl">
        This page hit a snag.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The rest of the site is fine. Try again, or head back home — if it keeps
        happening, get in touch.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <a href="/" className="btn-secondary">
          Back home
        </a>
      </div>
      {error.digest ? (
        <p className="mt-8 text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          Reference: {error.digest}
        </p>
      ) : null}
    </section>
  );
}
