// Picks the header's text color by sampling what's actually rendered behind
// it, rather than guessing from scroll position. A hero photo can be dark in
// one spot and near-white a few hundred pixels over, so a single "are we
// over the hero" flag isn't enough — this checks what's behind each header
// element individually.

export type InkOption = {
  className: string;
  luminance: number;
  // The accent is the site's signature color — it should win against the
  // neutral bg/cream option whenever it's reasonably legible, not only when
  // it happens to be the single highest-contrast pick. Plain "maximize
  // contrast" skews hard towards a light neutral bg (close to white) being
  // picked over the accent on almost every dark-to-midtone photo, even
  // where the accent would still read perfectly fine — see pickBestInk.
  preferred?: boolean;
};

// The nav is only ever allowed to be the site's background color or its
// accent — never plain black/white — so it reads as part of the same small
// palette wherever it lands. Read live from the CSS variables (rather than
// hardcoded hex here) so this stays correct as that palette keeps changing
// during the design pass, with no code change needed on this end.
const FALLBACK_INK_OPTIONS: InkOption[] = [
  { className: "text-bg", luminance: relativeLuminance(0x36, 0x31, 0x99) },
  { className: "text-accent", luminance: relativeLuminance(0xe2, 0xb4, 0xbd), preferred: true },
];

// How much contrast the accent needs against the sampled patch before it's
// considered "legible enough" to use despite not being the mathematically
// highest-contrast option. Deliberately low (most text-contrast guidelines
// start around 3:1 for large text) — this is a floor against the accent
// actually disappearing into the background, not a legibility target.
const MIN_PREFERRED_CONTRAST = 1.5;

let inkProbeEl: HTMLSpanElement | null = null;

function resolveCssVarLuminance(varName: string): number | null {
  if (typeof document === "undefined") return null;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return null;

  if (!inkProbeEl) {
    inkProbeEl = document.createElement("span");
    inkProbeEl.style.display = "none";
    document.body.appendChild(inkProbeEl);
  }
  inkProbeEl.style.color = raw;
  const rgb = parseRgb(getComputedStyle(inkProbeEl).color);
  return rgb ? relativeLuminance(...rgb) : null;
}

export function getInkOptions(): InkOption[] {
  const bgLuminance = resolveCssVarLuminance("--bg");
  const accentLuminance = resolveCssVarLuminance("--accent");
  const options: InkOption[] = [];
  if (bgLuminance !== null) options.push({ className: "text-bg", luminance: bgLuminance });
  if (accentLuminance !== null) options.push({ className: "text-accent", luminance: accentLuminance, preferred: true });
  return options.length ? options : FALLBACK_INK_OPTIONS;
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function pickBestInk(backgroundLuminance: number, options: InkOption[]): string {
  const preferred = options.find((o) => o.preferred);
  if (preferred && contrastRatio(preferred.luminance, backgroundLuminance) >= MIN_PREFERRED_CONTRAST) {
    return preferred.className;
  }

  let best = options[0];
  let bestRatio = -Infinity;
  for (const option of options) {
    const ratio = contrastRatio(option.luminance, backgroundLuminance);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = option;
    }
  }
  return best.className;
}

function parseRgb(value: string): [number, number, number] | null {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  const alpha = match[4] === undefined ? 1 : Number(match[4]);
  if (alpha < 0.05) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

type Rect = { left: number; top: number; width: number; height: number };

// `getComputedStyle` resolves keywords like "right" or "top" down to
// percentages (e.g. "100% 50%"), so this covers every `object-position`
// value in use without needing to special-case each keyword.
function parseObjectPosition(value: string): [number, number] {
  const matches = value.match(/-?[\d.]+%/g);
  if (!matches || matches.length < 2) return [0.5, 0.5];
  return [parseFloat(matches[0]) / 100, parseFloat(matches[1]) / 100];
}

function intersectRect(a: Rect, b: Rect): Rect | null {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.left + a.width, b.left + b.width);
  const bottom = Math.min(a.top + a.height, b.top + b.height);
  if (right <= left || bottom <= top) return null;
  return { left, top, width: right - left, height: bottom - top };
}

let sampleCanvas: HTMLCanvasElement | null = null;
const SAMPLE_GRID = 6;

// Reads the *average* luminance of the patch of `img` that sits directly
// behind `targetRect`, accounting for how object-fit actually maps the
// natural image onto the element's box. A single pixel probe (or a handful
// of them) can land on a dark speck of grain or a light fleck of paper
// texture and swing wildly from one nav item to its neighbour even though
// both sit on the same patch of photo — averaging over the whole patch
// instead of poking at a few points is what makes neighbouring elements
// agree. Returns null when `targetRect` falls entirely outside the visible
// image (e.g. a contain letterbox margin) or the canvas read fails (e.g. a
// cross-origin image without CORS headers).
//
// `object-fit: contain` letterboxes: the element's own box (`rect`) is
// bigger than the image actually drawn inside it, so `visible` shrinks down
// to just the drawn area, and that area maps 1:1 onto the *whole* natural
// image (nothing is cropped).
//
// `object-fit: cover` is the opposite: the box is always fully painted (no
// letterbox margins, so `visible` is just `rect`), but only a cropped
// sub-rect of the natural image — picked by `scale = max(w/naturalW,
// h/naturalH)` and centered per object-position — actually lands inside it.
// Every target used with this sampler (`fill`-mode Next/Image) has an <img>
// box equal to its container regardless of object-fit, which is what makes
// this distinction necessary rather than cosmetic.
function sampleImageRegionLuminance(img: HTMLImageElement, targetRect: Rect): number | null {
  if (!img.complete || !img.naturalWidth || !img.naturalHeight) return null;

  const rect = img.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const { naturalWidth, naturalHeight } = img;
  const containerAspect = rect.width / rect.height;
  const imageAspect = naturalWidth / naturalHeight;
  const [posX, posY] = parseObjectPosition(getComputedStyle(img).objectPosition);
  const isCover = getComputedStyle(img).objectFit === "cover";

  let visible: Rect;
  // The natural-image-space rect (origin + size) that `visible` maps onto —
  // the whole image for contain, a cropped sub-rect for cover.
  let srcLeft = 0;
  let srcTop = 0;
  let srcWidth = naturalWidth;
  let srcHeight = naturalHeight;

  if (isCover) {
    visible = rect;
    const scale = Math.max(rect.width / naturalWidth, rect.height / naturalHeight);
    srcWidth = rect.width / scale;
    srcHeight = rect.height / scale;
    srcLeft = (naturalWidth - srcWidth) * posX;
    srcTop = (naturalHeight - srcHeight) * posY;
  } else if (imageAspect > containerAspect) {
    const height = rect.width / imageAspect;
    visible = { left: rect.left, top: rect.top + (rect.height - height) * posY, width: rect.width, height };
  } else {
    const width = rect.height * imageAspect;
    visible = { left: rect.left + (rect.width - width) * posX, top: rect.top, width, height: rect.height };
  }

  const patch = intersectRect(targetRect, visible);
  if (!patch) return null;

  const sx = srcLeft + ((patch.left - visible.left) / visible.width) * srcWidth;
  const sy = srcTop + ((patch.top - visible.top) / visible.height) * srcHeight;
  const sw = (patch.width / visible.width) * srcWidth;
  const sh = (patch.height / visible.height) * srcHeight;
  if (sw <= 0 || sh <= 0) return null;

  try {
    if (!sampleCanvas) sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = SAMPLE_GRID;
    sampleCanvas.height = SAMPLE_GRID;
    const ctx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    // Downscaling the patch onto a small canvas lets the browser's own image
    // resampling do the averaging for us, across every pixel in the patch
    // rather than a handful of sparse probes.
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SAMPLE_GRID, SAMPLE_GRID);
    const { data } = ctx.getImageData(0, 0, SAMPLE_GRID, SAMPLE_GRID);
    let r = 0;
    let g = 0;
    let b = 0;
    const count = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    return relativeLuminance(r / count, g / count, b / count);
  } catch {
    return null;
  }
}

/**
 * Samples the luminance of whatever is visually behind `excludeEl` (one
 * header element — the logo, a nav link, the hamburger), so each can pick
 * its own ink independently.
 *
 * `elementsFromPoint` returns the full stack of overlapping elements at a
 * point, not just the topmost one. That matters here: the hero's dark scrim
 * (`.hero-fade`) is an absolutely-positioned div sitting right on top of the
 * photo, but it paints via a CSS gradient rather than `background-color`, so
 * it reads as transparent. Elements like that are skipped in favor of the
 * next element down the stack, until something that actually paints — an
 * image or an opaque background color — is found.
 */
export function sampleBackgroundLuminance(excludeEl: HTMLElement): number | null {
  const rect = excludeEl.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  const targetRect: Rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const stack = document.elementsFromPoint(cx, cy);

  for (const node of stack) {
    // Only skip descendants of the sampled element itself (its own text
    // spans, etc). Skipping ancestors too seems safer at a glance, but the
    // real background color almost always lives on a true DOM ancestor
    // (<body>, or <main> when the header is nested inside it on a detail
    // page) reached by seeing through transparent wrappers in between —
    // excluding ancestors blocks that walk-up entirely and leaves nothing
    // left to sample.
    if (excludeEl.contains(node)) continue;

    if (node instanceof HTMLImageElement) {
      const sampled = sampleImageRegionLuminance(node, targetRect);
      if (sampled !== null) return sampled;
      continue; // excludeEl falls in this image's letterboxed margin — keep looking
    }

    const rgb = parseRgb(getComputedStyle(node).backgroundColor);
    if (rgb) return relativeLuminance(...rgb);
    // fully transparent and not an image (e.g. a gradient scrim) — see through it
  }

  return null;
}
