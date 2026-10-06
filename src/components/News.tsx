import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/image";
import type { NewsItem } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function News({ news }: { news: NewsItem[] }) {
  if (!news.length) return null;

  return (
    <section id="news" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col gap-14 md:gap-20">
          {news.map((item, i) => {
            const imageUrl = item.image
              ? urlFor(item.image)?.width(1200).url()
              : null;
            const hasText = Boolean(item.mainText?.length);
            // No aspect ratio data (e.g. an image predating this field) —
            // fall back to a plain landscape box rather than a guess.
            const aspectRatio =
              item.imageWidth && item.imageHeight ? item.imageWidth / item.imageHeight : 4 / 3;
            return (
              <Reveal
                key={item._id}
                delay={(i % 2) * 100}
                className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12"
              >
                {imageUrl ? (
                  // Sized by the image's own proportions — a wide photo or a
                  // tall poster both show in full, nothing cropped out.
                  <div
                    className="relative w-full overflow-hidden bg-surface md:w-1/2"
                    style={{ aspectRatio }}
                  >
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="photo object-cover"
                    />
                  </div>
                ) : null}
                <div className={imageUrl ? "md:w-1/2" : "w-full"}>
                  <p className="text-sm text-muted">
                    {new Date(item.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-2 text-2xl uppercase tracking-tight md:text-3xl">
                    {item.title}
                  </h3>
                  {hasText ? (
                    <div className="prose prose-neutral mt-4 max-w-lg text-muted [&_p]:my-2">
                      <PortableText value={item.mainText!} />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
