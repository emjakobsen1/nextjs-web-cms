import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { Sponsor } from "@/sanity/queries";

export default function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="grid w-fit grid-cols-3 gap-8 sm:gap-12">
      {sponsors.map((sponsor, i) => {
        const src = urlFor(sponsor.image)?.width(240).url();
        return (
          <a
            key={i}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3"
          >
            {src ? (
              <Image
                src={src}
                alt={sponsor.name}
                width={120}
                height={120}
                className="photo h-16 w-16 object-contain opacity-80 transition-opacity group-hover:opacity-100 sm:h-20 sm:w-20"
              />
            ) : null}
            <span className="text-center text-xs tracking-wide text-muted uppercase transition-colors group-hover:text-fg">
              {sponsor.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
