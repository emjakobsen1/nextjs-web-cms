import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { Hero as HeroData } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Hero({ hero }: { hero: HeroData | null }) {
  if (!hero) return null;

  const imageUrl = hero.image ? urlFor(hero.image)?.width(1920).height(1080).url() : null;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-fg">
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

      <div className="relative w-full px-6 text-center">
        <Reveal as="h1" duration={700}>
          <span className="block text-[clamp(1.6rem,6vw,3.75rem)] font-light uppercase leading-[1.05] tracking-tight text-white">
            {hero.heading}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
