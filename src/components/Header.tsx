"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAdaptiveInks } from "@/hooks/useAdaptiveInks";
import RollText from "./RollText";

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
      <div
        className={`transition-transform ease-in-out ${
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

          <nav className="hidden items-center gap-1 md:flex">
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
            className={`relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 transition-colors duration-300 md:hidden ${
              open ? "text-accent" : inkClasses[HAMBURGER]
            }`}
          >
            <span
              className={`block h-px w-5 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-bg transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="px-4 py-4 text-2xl uppercase tracking-[0.08em] text-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
