"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  {
    label: "Releases",
    href: "#releases",
    src: "/images/releases-removebg-preview.png",
    width: 299,
    height: 81,
  },
  {
    label: "Concerts",
    href: "#concerts",
    src: "/images/concerts-removebg-preview.png",
    width: 239,
    height: 57,
  },
  {
    label: "About",
    href: "#about",
    src: "/images/about-removebg-preview.png",
    width: 223,
    height: 93,
  },
  {
    label: "Contact",
    href: "#contact",
    src: "/images/contact-removebg-preview.png",
    width: 215,
    height: 83,
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="px-2 py-2 text-lg uppercase tracking-[0.15em]"
        >
          Jesper L&oslash;rup
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center px-4 py-2.5 transition-colors hover:bg-lavender"
            >
              <Image
                src={link.src}
                alt={link.label}
                width={link.width}
                height={link.height}
                className="ink-fat h-5 w-auto"
              />
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 transition-colors hover:bg-lavender md:hidden"
        >
          <span
            className={`block h-px w-5 bg-black transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-black transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-black transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-cream transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="flex w-64 items-center px-4 py-4 transition-colors hover:bg-lavender"
          >
            <Image
              src={link.src}
              alt={link.label}
              width={link.width}
              height={link.height}
              className="ink-fat h-10 w-auto"
            />
          </a>
        ))}
      </div>
    </header>
  );
}
