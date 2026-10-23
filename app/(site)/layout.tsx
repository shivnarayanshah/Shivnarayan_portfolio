import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { SmoothScrollProvider } from "@/components/site/smooth-scroll-provider";
import { getSiteConfig } from "@/lib/data/site-config";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <SmoothScrollProvider>
      <div id="top" className="relative flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <CustomCursor />
        <ScrollProgress />
        <div aria-hidden className="site-grain" />
        <Navbar config={config} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer config={config} />
      </div>
    </SmoothScrollProvider>
  );
}
