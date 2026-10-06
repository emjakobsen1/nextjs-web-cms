"use client";

import { useEffect, useRef, useState } from "react";
import FlushLeftLine from "./FlushLeftLine";
import Reveal from "./Reveal";

// How much of the hero the title text should fill. Release titles vary
// wildly in length ("EP" vs "Sketches From The Black Box"), so a fixed
// clamp() can't target both a width and a height at once — this measures
// the actual text and searches for the font size (and line wrapping) that
// best fills this box, instead of guessing per title.
const TARGET_WIDTH_RATIO = 0.8;
const LINE_HEIGHT_RATIO = 0.8; // matches the leading-[0.8] used on the line

// Differential two-row layout: the last word gets its own row, sized up, so
// a multi-word title reads as a small line topped by one big emphasized
// word rather than uniform wrapped text.
const TOTAL_HEIGHT_RATIO = 0.4; // 200% of the single-row 20%-of-viewport target
const ROW2_HEIGHT_SHARE = 0.75; // row 2 occupies 75% of the total title height

export default function HeroTitle({ text, className = "" }: { text: string; className?: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fit, setFit] = useState<{ lines: string[]; fontSizes: number[] } | null>(null);
  const [bottomOffset, setBottomOffset] = useState(0);
  const bottomOffsetRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function computeFit() {
      if (typeof document.fonts?.ready?.then === "function") {
        try {
          await document.fonts.ready;
        } catch {
          // proceed with whatever is loaded
        }
      }
      if (cancelled) return;

      const measureEl = measureRef.current;
      if (!measureEl) return;

      const words = text.toUpperCase().split(" ").filter(Boolean);
      if (!words.length) return;

      const targetWidth = window.innerWidth * TARGET_WIDTH_RATIO;

      // Measures against the actual rendered font via a hidden DOM node —
      // canvas measureText can silently resolve to next/font's metrics
      // fallback rather than the real webfont, which threw width predictions
      // off by a wide margin here.
      const widthAt = (str: string, fontPx: number) => {
        measureEl.style.fontSize = `${fontPx}px`;
        measureEl.textContent = str;
        return measureEl.getBoundingClientRect().width;
      };

      // A multi-word title splits into two rows: the last word alone on
      // row 2 (bigger), everything else on row 1 (smaller). A single-word
      // title has nothing to split off, so it falls through to the uniform
      // wrap-and-fit below instead.
      if (words.length >= 2) {
        const row2 = words[words.length - 1];
        const row1 = words.slice(0, -1).join(" ");

        const targetTotalHeight = window.innerHeight * TOTAL_HEIGHT_RATIO;
        // row2Size / (row1Size + row2Size) = ROW2_HEIGHT_SHARE
        let row1Size = targetTotalHeight / (LINE_HEIGHT_RATIO * (1 + ROW2_HEIGHT_SHARE / (1 - ROW2_HEIGHT_SHARE)));
        let row2Size = row1Size * (ROW2_HEIGHT_SHARE / (1 - ROW2_HEIGHT_SHARE));

        const w1 = widthAt(row1, row1Size);
        const w2 = widthAt(row2, row2Size);
        const overflow = Math.max(w1 / targetWidth, w2 / targetWidth, 1);
        row1Size /= overflow;
        row2Size /= overflow;

        if (!cancelled) setFit({ lines: [row1, row2], fontSizes: [row1Size, row2Size] });
        return;
      }

      // Wrap at one uniform size aiming to fill 80% width / 20% height.
      const targetHeight = window.innerHeight * 0.2;

      const wrapAt = (fontPx: number) => {
        const lines: string[] = [];
        let current = "";
        for (const word of words) {
          const candidate = current ? `${current} ${word}` : word;
          if (current && widthAt(candidate, fontPx) > targetWidth) {
            lines.push(current);
            current = word;
          } else {
            current = candidate;
          }
        }
        if (current) lines.push(current);
        return lines;
      };

      let lo = 8;
      let hi = 1000;
      let bestSize = lo;
      let bestLines = [words.join(" ")];

      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        const wrapped = wrapAt(mid);
        const totalHeight = wrapped.length * mid * LINE_HEIGHT_RATIO;
        const widest = Math.max(...wrapped.map((l) => widthAt(l, mid)));

        if (totalHeight <= targetHeight && widest <= targetWidth) {
          bestSize = mid;
          bestLines = wrapped;
          lo = mid;
        } else {
          hi = mid;
        }
      }

      if (!cancelled) setFit({ lines: bestLines, fontSizes: bestLines.map(() => bestSize) });
    }

    computeFit();
    window.addEventListener("resize", computeFit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", computeFit);
    };
  }, [text]);

  // The bottom line needs to land exactly on the hero's border — not a
  // rough guess, since the tight leading-[0.8] line-height means the
  // rendered line box's own edge doesn't correspond to anything meaningful.
  // Align to the typographic BASELINE, not the string's deepest ink: flat
  // letters (A, I, T, N...) sit exactly on the baseline, while round ones
  // (O, Ø, C...) overshoot it by a few px for optical correction. Canvas
  // metrics give the deepest point across the whole string via
  // actualBoundingBoxDescent, which is dominated by whichever letter
  // overshoots most — anchoring to that instead of the baseline put only
  // that one letter on the border and left every flat letter floating a few
  // px above it (worse the more a title's round letters overshoot).
  useEffect(() => {
    if (!fit) return;
    const lineEl = lineRefs.current[fit.lines.length - 1];
    const textNode = lineEl?.firstChild;
    const heroSection = lineEl?.closest("section");
    if (!lineEl || !textNode || textNode.nodeType !== Node.TEXT_NODE || !heroSection) return;

    const measure = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cs = getComputedStyle(lineEl);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const metrics = ctx.measureText(textNode.textContent ?? "");

      const range = document.createRange();
      range.selectNodeContents(textNode);
      const rect = range.getClientRects()[0];
      if (!rect) return;

      const baselineY = rect.bottom - metrics.fontBoundingBoxDescent;
      const borderY = heroSection.getBoundingClientRect().bottom;

      // rect/borderY already reflect whatever offset is currently applied
      // (from a previous measurement, e.g. before a resize) — back that out
      // to find the untransformed position, then solve for the new offset.
      const naturalBaselineY = baselineY - bottomOffsetRef.current;
      const needed = borderY - naturalBaselineY;
      bottomOffsetRef.current = needed;
      setBottomOffset(needed);
    };

    // The line lives inside the hero's <Reveal as="h1"> wrapper, which
    // slides up from translateY(16px) over 700ms on mount. A single
    // measurement can land mid-transition (or before the IntersectionObserver
    // has even flipped it to visible), baking in an offset for a position the
    // line is about to move away from — settle timers re-run it until the
    // reveal transition has long since settled.
    measure();
    const settleTimers = [100, 400, 900, 1500].map((ms) => setTimeout(measure, ms));
    window.addEventListener("resize", measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(heroSection);
    return () => {
      settleTimers.forEach(clearTimeout);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
    };
  }, [fit]);

  const lines = fit?.lines ?? [text];
  const fontSizes = fit?.fontSizes;

  return (
    <Reveal as="h1" duration={700} className={fit ? "" : "invisible"}>
      <span
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 whitespace-nowrap opacity-0 ${className}`}
      />
      {lines.map((line, i, arr) => (
        <FlushLeftLine
          key={`${line}-${i}`}
          text={line}
          fontSize={fontSizes?.[i]}
          className={`block ${className}`}
          style={i === arr.length - 1 ? { transform: `translateY(${bottomOffset}px)` } : undefined}
          spanRef={(el) => {
            lineRefs.current[i] = el;
          }}
        />
      ))}
    </Reveal>
  );
}
