import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Hero as HeroData } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Hero({ hero }: { hero: HeroData | null }) {
  if (!hero) return null;

  const ctaHref = hero.linkedRelease
    ? `/releases/${hero.linkedRelease.slug.current}`
    : "#projects";
  const imageUrl = hero.image ? urlFor(hero.image)?.width(1920).height(1080).url() : null;

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-fg">
      {hero.mediaType === "video" && hero.video?.asset?.url ? (
        <video
          src={hero.video.asset.url}
          autoPlay
          muted
          loop
          playsInline
          className="photo absolute inset-0 h-full w-full object-cover"
        />
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={hero.heading}
          fill
          priority
          sizes="100vw"
          className="photo object-cover"
        />
      ) : null}

      <div className="hero-fade absolute inset-0" />

      <div className="relative w-full px-4 pb-[8vh] md:px-6 md:pb-[6vh]">
        <div className="mx-auto max-w-6xl">
          <Reveal as="h1" duration={700}>
            <span className="block text-[clamp(1.6rem,6vw,3.75rem)] font-light uppercase leading-[1.05] tracking-tight text-white">
              {hero.heading}
            </span>
          </Reveal>

          <Reveal delay={150} duration={700} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="bg-white px-7 py-3.5 text-sm uppercase tracking-[0.1em] text-black transition-colors hover:bg-white/80"
            >
              {hero.linkedRelease ? "Listen" : "Explore"}
            </Link>
            <a
              href="#agenda"
              className="border border-white/40 px-7 py-3.5 text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
            >
              Shows
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
