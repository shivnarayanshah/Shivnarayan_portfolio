"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

type GsapContext = { revert: () => void };

/**
 * Owns the page's scroll experience:
 *  - Lenis inertial scrolling, driven by GSAP's ticker (so ScrollTrigger and
 *    Lenis never disagree about scroll position).
 *  - `[data-reveal]` entrance animations that re-scan on every navigation.
 *  - In-page anchor scrolling that works with Lenis.
 *
 * Everything is skipped entirely when the visitor prefers reduced motion.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    async function init() {
      const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new LenisCtor({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        autoRaf: false,
      });

      lenisRef.current = lenis;

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      teardown = () => {
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };

      ScrollTrigger.refresh();
    }

    void init();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  // Reveal animations are re-created per route. The small delay lets the
  // streamed page content settle before ScrollTrigger measures it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let context: GsapContext | undefined;

    const timer = window.setTimeout(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          const bounds = element.getBoundingClientRect();
          const alreadyVisible =
            bounds.bottom > 0 && bounds.top < window.innerHeight;

          // Do not hide content the visitor can already see. Re-running the
          // entrance animation on above-the-fold content after a client-side
          // navigation makes the page appear to render twice.
          if (alreadyVisible) return;

          const direction = element.dataset.reveal;
          const delay = Number(element.dataset.revealDelay ?? 0);
          const from: gsap.TweenVars = { opacity: 0, y: 26 };
          if (direction === "left") {
            from.y = 0;
            from.x = -32;
          }
          if (direction === "right") {
            from.y = 0;
            from.x = 32;
          }
          if (direction === "scale") {
            from.y = 18;
            from.scale = 0.97;
          }
          if (direction === "fade") {
            from.y = 0;
          }

          gsap.fromTo(element, from, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.95,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      context?.revert();
    };
  }, [pathname]);

  // Reset scroll on navigation, or honour a hash link once the page exists.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector<HTMLElement>(hash);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -96, immediate: true });
          } else {
            target.scrollIntoView();
          }
          return;
        }
      }
      lenisRef.current?.scrollTo(0, { immediate: true });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Lenis takes over wheel scrolling, so native anchor jumps have to be routed
  // through it manually.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -96, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState(null, "", hash);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
