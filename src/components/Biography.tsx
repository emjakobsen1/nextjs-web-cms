import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/image";
import type { Biography as BiographyData } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Biography({ biography }: { biography: BiographyData | null }) {
  if (!biography) return null;

  const imageUrl = biography.image
    ? urlFor(biography.image)?.width(1200).height(1500).url()
    : null;

  return (
    <section id="biography" className="px-1.5 py-6 md:px-2 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-16">
        <Reveal className="relative aspect-[4/5] w-full bg-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Jesper Lørup"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="photo object-cover"
            />
          ) : null}
        </Reveal>

        <div>
          <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
            Biography
          </Reveal>
          {biography.pullQuote ? (
            <Reveal
              delay={80}
              as="p"
              className="mt-6 text-2xl font-light italic leading-snug tracking-tight md:text-3xl"
            >
              &ldquo;{biography.pullQuote}&rdquo;
            </Reveal>
          ) : null}
          <Reveal delay={160} className="prose prose-neutral mt-6 max-w-lg text-muted [&_p]:my-3">
            <PortableText value={biography.description} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
