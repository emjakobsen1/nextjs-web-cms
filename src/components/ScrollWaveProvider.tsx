"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

type WaveEdges = { left: boolean; right: boolean };

type WaveOptions = {
  /** Resting inset of a wavy edge, in % of the element's width. */
  baseInset?: number;
  /** How far the edge swings in/out, in % of the element's width. */
  amplitude?: number;
};

type RegisteredEl = {
  el: HTMLElement;
  edges: WaveEdges;
  options: Required<WaveOptions>;
};

type ScrollWaveContextValue = {
  register: (
    el: HTMLElement | null,
    key: string,
    edges: WaveEdges,
    options: Required<WaveOptions>,
  ) => void;
};

const ScrollWaveContext = createContext<ScrollWaveContextValue | null>(null);

const DEFAULT_OPTIONS: Required<WaveOptions> = {
  baseInset: 6,
  amplitude: 2,
};

// Radians of sine phase per pixel of *viewport-relative* vertical position.
// Sampling the wave from each element's live position on screen — rather
// than a 0–1 range local to that element, or a phase shared through some
// other channel — means every registered element, whatever its size, reads
// off the same continuous curve. Adjacent images line up instead of each
// restarting its own cycle, and the pattern animates for free as elements
// move up the viewport during scroll.
const FREQUENCY_PER_PX = 0.005;
const SEGMENTS = 32;

// How sharply the wave's range falls off as an edge sits further inside the
// viewport's own margins. An edge sitting right at the viewport's edge (e.g.
// the media grid, which runs full-bleed) gets the full amplitude; an edge
// inset well toward the center (e.g. the hero image, inset ~10% each side)
// gets a much smaller one. marginScale(0) = 1, marginScale(0.1) ≈ 0.3.
const MARGIN_DECAY = 12;

function marginScale(distancePx: number, viewportWidth: number) {
  const fraction = Math.max(0, distancePx) / viewportWidth;
  return Math.exp(-MARGIN_DECAY * fraction);
}

function buildClipPath(
  el: HTMLElement,
  edges: WaveEdges,
  options: Required<WaveOptions>,
) {
  const { baseInset, amplitude } = options;
  const rect = el.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const leftAmplitude = edges.left
    ? amplitude * marginScale(rect.left, viewportWidth)
    : 0;
  const rightAmplitude = edges.right
    ? amplitude * marginScale(viewportWidth - rect.right, viewportWidth)
    : 0;

  const left: string[] = [];
  const right: string[] = [];

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const y = (t * 100).toFixed(2);
    const viewportY = rect.top + t * rect.height;
    const sine = Math.sin(viewportY * FREQUENCY_PER_PX);
    const leftX = edges.left ? baseInset + sine * leftAmplitude : 0;
    const rightX = edges.right ? 100 - baseInset - sine * rightAmplitude : 100;
    left.push(`${leftX.toFixed(2)}% ${y}%`);
    right.push(`${rightX.toFixed(2)}% ${y}%`);
  }
  right.reverse();

  return `polygon(${left.join(",")}, ${right.join(",")})`;
}

// Provides a soft, inertia-based scroll (via Lenis) and, on any registered
// element, a sine-wave clip-path along its left and/or right edge — so the
// image reads as if it's being pulled past a fixed wavy surface, rather
// than the image itself warping. Scopes itself to the release modal's own
// scroll container when rendered inside it (`#modal-scroll-root` /
// `#modal-scroll-content`), or to the window on the standalone release page.
export default function ScrollWaveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const elsRef = useRef(new Map<string, RegisteredEl>());

  const register = useCallback(
    (
      el: HTMLElement | null,
      key: string,
      edges: WaveEdges,
      options: Required<WaveOptions>,
    ) => {
      if (el) elsRef.current.set(key, { el, edges, options });
      else elsRef.current.delete(key);
    },
    [],
  );

  useEffect(() => {
    const wrapper = document.getElementById("modal-scroll-root");
    const content = document.getElementById("modal-scroll-content");

    const lenis = new Lenis(
      wrapper && content
        ? { wrapper, content, autoRaf: true }
        : { autoRaf: true },
    );

    let rafId: number;

    const tick = () => {
      for (const { el, edges, options } of elsRef.current.values()) {
        el.style.clipPath = buildClipPath(el, edges, options);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const value = useMemo(() => ({ register }), [register]);

  return (
    <ScrollWaveContext.Provider value={value}>
      {children}
    </ScrollWaveContext.Provider>
  );
}

export function useWaveClip(
  key: string,
  edges: WaveEdges,
  options?: WaveOptions,
) {
  const ctx = useContext(ScrollWaveContext);
  const resolved = { ...DEFAULT_OPTIONS, ...options };

  return useCallback(
    (el: HTMLElement | null) => {
      ctx?.register(el, key, edges, resolved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctx, key, edges.left, edges.right, resolved.baseInset, resolved.amplitude],
  );
}
