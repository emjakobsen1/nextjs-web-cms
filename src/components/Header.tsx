"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAdaptiveInks } from "@/hooks/useAdaptiveInks";
import RollText from "./RollText";
import ThemeToggle from "./ThemeToggle";

// Absolute (not bare "#section") so these still work when the header is
// rendered on a project/release page: they navigate home and land on the
// anchor, instead of just rewriting the current page's hash in place.
const NAV_LINKS = [
  { label: "Agenda", href: "/#agenda" },
  { label: "Music", href: "/#projects" },
  { label: "Archive", href: "/releases" },
  { label: "News", href: "/#news" },
  { label: "Biography", href: "/#biography" },
  { label: "Press", href: "/#press" },
  { label: "Contact", href: "/#contact" },
];

// Logo + hamburger + one entry per nav link, each tracked independently.
const LOGO = 0;
const HAMBURGER = 1;
const NAV_START = 2;
const INK_TARGET_COUNT = NAV_START + NAV_LINKS.length;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(open);
  const { setRef: setInkRef, inkClasses } = useAdaptiveInks(INK_TARGET_COUNT);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const toggleOpen = () => {
    setOpen((v) => {
      const next = !v;
      if (next) setHidden(false);
      return next;
    });
  };

  useEffect(() => {
    lastY.current = window.scrollY;

    const scheduleIdleReveal = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setHidden(false), 900);
    };

    const onScroll = () => {
      if (openRef.current) return;
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

  return (
    // No transform on this element itself: a transformed ancestor becomes
    // the containing block for `position: fixed` descendants (instead of
    // the viewport), which was clipping the full-screen mobile menu below
    // down to the header's own (short) height. The slide-hide transform
    // lives on the inner row below instead, so the overlay's `inset-0`
    // keeps resolving against the real viewport.
    <header className="fixed inset-x-0 top-0 z-50">
      {/* `relative z-50` here (not just on the hamburger button below) is
          load-bearing: the translateY slide-hide below gives this row a
          non-none transform, which makes it establish its own stacking
          context — without an explicit z-index on the row itself, that
          context ranks as z-index:auto at the <header> level, landing
          *below* the overlay's explicit z-40 regardless of the button's own
          z-50 inside it (z-index only ever competes within the same
          stacking context). That's what was swallowing the logo and the
          open/close button behind the mobile menu once it was open. */}
      <div
        className={`relative z-50 transition-transform ease-in-out ${
          hidden ? "duration-[400ms] -translate-y-full" : "duration-[200ms] translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-1 py-4">
          <Link
            href="/"
            ref={setInkRef(LOGO)}
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`text-lg uppercase tracking-[0.15em] transition-colors duration-300 ${
              open ? "text-accent" : inkClasses[LOGO]
            }`}
          >
            Jesper L&oslash;rup
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                ref={setInkRef(NAV_START + i)}
                href={link.href}
                className={`group px-3 py-2.5 text-sm uppercase tracking-[0.12em] transition-colors duration-300 ${inkClasses[NAV_START + i]}`}
              >
                <RollText text={link.label} />
              </a>
            ))}
          </nav>

          <button
            type="button"
            ref={setInkRef(HAMBURGER)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={toggleOpen}
            className={`relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 transition-colors duration-300 lg:hidden ${
              open ? "text-accent" : inkClasses[HAMBURGER]
            }`}
          >
            {/* Top and bottom bars rotate into a centered X (translate-y
                matches the gap-1.5 + h-px spacing between the three bars,
                so the two crossing strokes actually meet at a point rather
                than passing each other offset); the middle bar fades out. */}
            <span
              className={`block h-px bg-current transition-all duration-300 ${open ? "w-6 translate-y-[7px] rotate-45" : "w-5"}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${open ? "w-6 -translate-y-[7px] -rotate-45" : "w-5"}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-bg transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* top-20: clears the header row above (logo stays visible there
            even with the menu open), so this doesn't collide with it. */}
        <div className="absolute top-20 left-5">
          <ThemeToggle variant="inline" />
        </div>

        {/* Right-aligned within a centered column, rather than flush to the
            screen edge or centered character-by-character — reads as a
            deliberate ragged-right block sitting in the middle of the
            screen. */}
        <nav className="flex w-full max-w-xs flex-col items-end gap-2 px-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-4 text-right text-2xl uppercase tracking-[0.08em] text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}
