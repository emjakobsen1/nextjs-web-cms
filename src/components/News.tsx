import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/image";
import type { NewsItem } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function News({ news }: { news: NewsItem[] }) {
  if (!news.length) return null;

  return (
    <section id="news" className="border-t border-line px-4 py-10 md:px-5 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          News
        </Reveal>

        <div className="mt-10 flex flex-col gap-14 md:mt-14 md:gap-20">
          {news.map((item, i) => {
            const imageUrl = item.image ? urlFor(item.image)?.width(1200).height(800).url() : null;
            return (
              <Reveal
                key={item._id}
                delay={(i % 2) * 100}
                className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12"
              >
                {imageUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface md:w-2/5">
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="photo object-cover"
                    />
                  </div>
                ) : null}
                <div className={imageUrl ? "md:w-3/5" : "w-full"}>
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
                  <div className="prose prose-neutral mt-4 max-w-lg text-muted [&_p]:my-2">
                    <PortableText value={item.mainText} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
