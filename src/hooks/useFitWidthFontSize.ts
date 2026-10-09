"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Picks the largest font size, up to `maxVh`% of viewport height, that
 * still keeps `text` within `widthRatio` of the viewport width on one
 * line. A fixed vh-based size (e.g. project page titles at 11vh) looks
 * right for short titles but overflows the screen for longer ones
 * ("Hi-Fi Quartet", "Kosmos Trio") on narrow/tall mobile viewports —
 * text width scales linearly with font-size, so one measurement at the
 * max size is enough to scale it down exactly, no search needed.
 *
 * Render a hidden span with the returned `measureRef` (same className as
 * the real title, so it measures the real font/tracking/case) somewhere
 * off-screen, and pass the returned `fontSize` to FlushLeftLine.
 */
export function useFitWidthFontSize(
  text: string,
  { maxVh = 11, widthRatio = 0.92 }: { maxVh?: number; widthRatio?: number } = {},
) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl || !text) return;

    const fit = () => {
      const maxPx = (window.innerHeight * maxVh) / 100;
      measureEl.style.fontSize = `${maxPx}px`;
      measureEl.textContent = text;
      const width = measureEl.getBoundingClientRect().width;
      const targetWidth = window.innerWidth * widthRatio;
      setFontSize(width > targetWidth ? maxPx * (targetWidth / width) : maxPx);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text, maxVh, widthRatio]);

  return { fontSize, measureRef };
}
