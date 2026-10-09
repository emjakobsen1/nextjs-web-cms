import Link from "next/link";

// Sits directly under the header's menu icon on mobile (same right inset as
// its px-1 row, just below its h-11 button) so the two read as one cluster
// instead of the close mark floating alone lower on the page. Desktop has
// room to sit lower, clear of the nav links.
export default function CloseLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Close"
      className="fixed top-16 right-1 z-10 text-6xl leading-none font-normal text-fg transition-opacity hover:opacity-70 md:top-28 md:right-6"
    >
      &times;
    </Link>
  );
}
