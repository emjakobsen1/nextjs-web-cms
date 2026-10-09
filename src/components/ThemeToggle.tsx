"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/theme";
import { useTheme } from "./ThemeProvider";

// Mirrors Header's own scroll-driven show/hide thresholds exactly, so this
// floating switch pops in and out in lockstep with the nav bar rather than
// drifting out of sync with it.
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const scheduleIdleReveal = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setHidden(false), 900);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 80) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }
      lastY.current = y;
      scheduleIdleReveal();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const activeIndex = Math.max(
    0,
    THEMES.findIndex((t) => t.id === theme),
  );

  return (
    // Below lg (wherever the header shows its hamburger instead of the full
    // nav row), this centered pill would otherwise land right on top of the
    // "Jesper Lørup" logo on narrow screens — bumped onto its own row under
    // the header instead. At lg and up there's room beside the nav links,
    // so it goes back to sharing the header's own row.
    <div
      className={`pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center py-4 transition-transform ease-in-out lg:top-0 ${
        hidden ? "duration-[400ms] -translate-y-full" : "duration-[200ms] translate-y-0"
      }`}
    >
      <div
        role="radiogroup"
        aria-label="Colour theme"
        className="pointer-events-auto relative flex items-center gap-0.5 rounded-full border border-line bg-surface/80 p-1 backdrop-blur-sm"
      >
        <span
          aria-hidden
          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-accent transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 1.75}rem)` }}
        />
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            aria-label={t.label}
            title={t.label}
            onClick={() => setTheme(t.id)}
            className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-fg/30"
              style={{ backgroundColor: t.swatch }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
