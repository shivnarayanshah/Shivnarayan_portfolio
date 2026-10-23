"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DatabaseZap, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] render error", error);
  }, [error]);

  const looksLikeDatabase = /mongo|database|connection/i.test(error.message);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
        <DatabaseZap className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-display text-3xl tracking-tight text-ink">
        {looksLikeDatabase ? "The database is out of reach." : "Something broke."}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        {looksLikeDatabase
          ? "The admin area needs a working MongoDB connection. Check MONGO_URI and your Atlas network access, then try again."
          : "This admin page failed to render. Try again — if it persists, check the server logs for the full error."}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <Link href="/admin/dashboard" className="btn-secondary">
          Back to dashboard
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          Reference: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
