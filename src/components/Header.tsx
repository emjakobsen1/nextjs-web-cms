"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RollText from "./RollText";

const NAV_LINKS = [
  { label: "Music", href: "#projects" },
  { label: "News", href: "#news" },
  { label: "Agenda", href: "#agenda" },
  { label: "Biography", href: "#biography" },
  { label: "Press", href: "#press" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const lastY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(open);

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
      // The hero section is the only dark, full-viewport block on the page —
      // once it's scrolled past, everything below is light.
      setOnDark(window.scrollY < window.innerHeight - 96);

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

  const inkClass = onDark ? "text-white" : "text-fg";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-in-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-1.5 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`text-lg uppercase tracking-[0.15em] transition-colors duration-300 ${inkClass}`}
        >
          Jesper L&oslash;rup
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group px-3 py-2.5 text-sm uppercase tracking-[0.12em] transition-colors duration-300 ${inkClass}`}
            >
              <RollText text={link.label} />
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={toggleOpen}
          className={`relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 transition-colors duration-300 md:hidden ${
            open ? "text-fg" : inkClass
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
            className="px-4 py-4 text-2xl uppercase tracking-[0.08em] text-fg"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
