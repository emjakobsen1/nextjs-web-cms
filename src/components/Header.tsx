"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  {
    label: "Releases",
    href: "#releases",
    src: "/images/releases-removebg-preview.png",
    width: 299,
    height: 81,
  },
  {
    label: "Videos",
    href: "#videos",
    src: "/images/videos-removebg-preview.png",
    width: 239,
    height: 57,
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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.5 6.5a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 0 0 1.5 6.5 31 31 0 0 0 1 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-5.5ZM9.8 15.5v-7l6.2 3.5-6.2 3.5Z" />
    </svg>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M7 10c3.2-1 7-.6 10 1.2M7.6 13.2c2.6-.8 5.6-.5 8 .9M8.3 16.2c2-.6 4.3-.4 6 .7" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.3C15.9 4.2 15 4.1 14 4.1c-2.2 0-3.7 1.3-3.7 3.8v2.5H7.7v3h2.6V21h3.2Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
  { label: "Spotify", href: "#", Icon: SpotifyIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > window.innerHeight - 96);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line bg-bg/95 backdrop-blur-sm"
          : "border-b-0 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="px-2 py-2 text-lg uppercase tracking-[0.15em]"
        >
          Jesper L&oslash;rup
        </Link>

        <nav className="hidden items-center gap-1 md:flex md:flex-1 md:justify-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2.5 transition-colors hover:bg-lavender"
            >
              <Image
                src={link.src}
                alt={link.label}
                width={link.width}
                height={link.height}
                className="ink-fat h-[1.1rem] w-auto"
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="text-black transition-colors hover:text-lavender"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

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
