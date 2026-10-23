"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const reduced = useReducedMotion();

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 26, mass: 0.4 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || reduced) return;

    setEnabled(true);

    const move = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setVisible(true);
      const target = event.target as Element | null;
      setInteractive(
        Boolean(
          target?.closest(
            'a, button, [role="button"], input, textarea, select, summary, [data-cursor="link"]',
          ),
        ),
      );
    };

    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [dotX, dotY, reduced]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block"
    >
      <motion.span
        className="absolute left-0 top-0 rounded-full border border-white/80 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: 30,
          height: 30,
          marginLeft: -15,
          marginTop: -15,
          opacity: visible ? 0.55 : 0,
        }}
        animate={{ scale: interactive ? 1.65 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
      <motion.span
        className="absolute left-0 top-0 rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          opacity: visible ? 0.9 : 0,
        }}
        animate={{ scale: interactive ? 0.4 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </div>
  );
}
