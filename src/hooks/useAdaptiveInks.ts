"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInkOptions, pickBestInk, sampleBackgroundLuminance } from "@/lib/contrastInk";

/**
 * Tracks its own ink color per target element, sampling what's actually
 * rendered behind each one individually. A single photo can be dark in one
 * spot and near-white in another at the same time, so one shared "on dark
 * background" flag isn't enough — each element needs its own read. Used by
 * the header's logo/nav links and by any other text sitting on top of a
 * photo that needs to stay readable (e.g. project titles).
 */
export function useAdaptiveInks(count: number) {
  const elements = useRef<(HTMLElement | null)[]>(Array(count).fill(null));
  const [inkClasses, setInkClasses] = useState<string[]>(() => Array(count).fill("text-bg"));

  const setRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      elements.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const options = getInkOptions();
      setInkClasses((prev) => {
        let changed = false;
        const next = elements.current.map((el, i) => {
          if (!el) return prev[i];
          const bg = sampleBackgroundLuminance(el);
          if (bg === null) return prev[i];
          const cls = pickBestInk(bg, options);
          if (cls !== prev[i]) changed = true;
          return cls;
        });
        return changed ? next : prev;
      });
    };

    const onChange = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    // Re-check shortly after mount too, in case a photo is still decoding
    // when this first runs.
    const settleTimers = [200, 600, 1500].map((ms) => setTimeout(update, ms));

    // Images below the fold load lazily, well after these settle timers
    // have already fired — without this, an element that first sampled "no
    // image yet, fall through to the page background" never gets
    // re-checked once that image actually arrives. `load` doesn't bubble,
    // but a capture-phase listener on the document still sees every <img>
    // finish loading anywhere on the page.
    document.addEventListener("load", onChange, true);

    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      cancelAnimationFrame(raf);
      settleTimers.forEach(clearTimeout);
      document.removeEventListener("load", onChange, true);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [count]);

  return { setRef, inkClasses };
}
