"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Most glyphs have a little breathing room before their ink actually
 * starts (left-side bearing) — fine for body text, but visible as an
 * awkward gap when a letter is blown up to hero size and meant to sit
 * flush against the edge. This measures the rendered font's actual ink
 * start for the line's first character and pulls it left to close that
 * gap, so the letter — not its invisible box — touches the edge.
 */
export default function FlushLeftLine({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    const measure = () => {
      const cs = getComputedStyle(el);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const metrics = ctx.measureText(text[0]);
      setOffset(Math.min(metrics.actualBoundingBoxLeft, 0));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  return (
    <span ref={ref} className={className} style={{ ...style, marginLeft: `${offset}px` }}>
      {text}
    </span>
  );
}
