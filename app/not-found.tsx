import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-ink">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight">
        Page not found.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        The page you were looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
