import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { ReleaseSummary } from "@/sanity/queries";

function ReleaseCover({ release }: { release: ReleaseSummary }) {
  const src = urlFor(release.image)?.width(800).height(800).url();
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={release.title}
      fill
      sizes="33vw"
      className="photo object-cover transition-transform duration-300 ease-out group-hover:scale-105"
    />
  );
}

export default function NextReleaseFooter({
  releases,
  currentSlug,
  originHref,
}: {
  releases: ReleaseSummary[];
  currentSlug: string;
  // Carried forward unchanged onto both links below, so hopping from release
  // to release never loses track of where this browsing session started —
  // the close button on whichever release you land on still points there.
  originHref: string;
}) {
  const index = releases.findIndex((release) => release.slug.current === currentSlug);
  if (index === -1) return null;

  const previous = index > 0 ? releases[index - 1] : undefined;
  const nextIndex = (index + 1) % releases.length;
  const next = releases[nextIndex];
  if (!next) return null;

  const fromQuery = `?from=${encodeURIComponent(originHref)}`;

  return (
    // The middle column's image is 70% of the column width, so the row's
    // height (which the image alone defines) is 0.7/3 of the row's width —
    // hence the 30/7 aspect ratio. Grid cells stretch to that same height by
    // default, so the flanking links can sit at top-[70%] of *their own*
    // cell and land at 70% of the image's height, not the row's.
    <div className="mt-16 flex flex-col items-center gap-4 sm:mt-24 sm:grid sm:grid-cols-3 sm:items-stretch sm:gap-0">
      <div className="hidden sm:relative sm:block">
        {previous && (
          <Link
            href={`/releases/${previous.slug.current}${fromQuery}`}
            className="absolute top-[70%] left-4 -translate-y-1/2 text-lg font-normal tracking-wide uppercase transition-opacity hover:opacity-70 sm:left-6 sm:text-xl"
          >
            {previous.title}
          </Link>
        )}
      </div>

      <Link
        href={`/releases/${next.slug.current}${fromQuery}`}
        className="group relative mx-auto block aspect-square w-1/2 overflow-hidden bg-surface sm:w-[70%]"
      >
        <ReleaseCover release={next} />
      </Link>

      <div className="hidden sm:relative sm:block">
        <Link
          href={`/releases/${next.slug.current}${fromQuery}`}
          className="absolute top-[70%] right-4 -translate-y-1/2 text-lg font-normal tracking-wide uppercase transition-opacity hover:opacity-70 sm:right-6 sm:text-xl"
        >
          Next Release
        </Link>
      </div>

      <div className="flex w-full max-w-xs items-center justify-between gap-4 px-2 text-sm font-normal tracking-wide uppercase sm:hidden">
        {previous ? (
          <Link
            href={`/releases/${previous.slug.current}${fromQuery}`}
            className="transition-opacity hover:opacity-70"
          >
            {previous.title}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={`/releases/${next.slug.current}${fromQuery}`}
          className="transition-opacity hover:opacity-70"
        >
          Next Release
        </Link>
      </div>
    </div>
  );
}
