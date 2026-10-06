import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { FeaturedRelease } from "@/sanity/queries";
import HeroTitle from "./HeroTitle";
import Reveal from "./Reveal";

export default function Hero({ release }: { release: FeaturedRelease | null }) {
  if (!release) return null;

  // Release art can be any shape (square cover, portrait photo, wide
  // landscape) — rather than force-cropping it to fill the frame and risk
  // cutting off the subject, it sits centered and uncropped against the
  // section's solid background.
  const foregroundUrl = release.image ? urlFor(release.image)?.width(1600).url() : null;

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-black">
      {foregroundUrl ? (
        <div className="absolute inset-0">
          <Image
            src={foregroundUrl}
            alt={release.title}
            fill
            priority
            sizes="100vw"
            className="photo object-contain object-right"
          />
        </div>
      ) : null}

      <div className="hero-fade absolute inset-0" />

      <div className="relative w-full">
        <HeroTitle
          text={release.title}
          className="font-light uppercase leading-[0.8] tracking-tight text-accent"
        />
      </div>

      <Reveal delay={220} className="absolute right-[1.5rem] bottom-[2.5rem] sm:right-[2.5rem] md:bottom-[3.5rem]">
        <Link
          href={`/releases/${release.slug.current}`}
          className="inline-flex flex-col items-end border border-accent/60 px-[4.5rem] py-[2rem] text-[2rem] leading-[0.95] uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent hover:text-black"
        >
          <span>Listen</span>
          <span>Now</span>
        </Link>
      </Reveal>
    </section>
  );
}
