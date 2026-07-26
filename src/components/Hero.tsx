import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-[86vh] items-end overflow-hidden md:min-h-[92vh]">
      <Image
        src="/images/jesper-loerup-hero.png"
        alt="Jesper Lørup playing drums live, with double bass in the background"
        fill
        priority
        sizes="100vw"
        className="photo object-cover object-bottom"
      />
      <div className="hero-fade absolute inset-0" />

      <div className="relative w-full px-4 pb-[18vh] md:px-6 md:pb-[15vh]">
        <div className="mx-auto max-w-6xl">
          <span className="inline-block border border-black/15 bg-lavender px-3 py-1 text-xs uppercase tracking-[0.14em] text-black">
            Drummer &middot; Improviser &middot; Composer
          </span>

          <h1 className="mt-4 text-[clamp(2.75rem,13vw,7.5rem)] font-normal uppercase leading-[0.92] tracking-tight text-white">
            Jesper L&oslash;rup
          </h1>

          <p className="mt-4 max-w-xl text-lg font-light italic leading-snug text-white/90 md:text-xl">
            Working in jazz, free improvisation and experimental live music
            &mdash; from packed clubs to empty rooms.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#releases"
              className="bg-white px-7 py-3.5 text-base uppercase tracking-[0.08em] text-black transition-colors hover:bg-lavender"
            >
              Listen
            </a>
            <a
              href="#concerts"
              className="bg-cream px-7 py-3.5 text-base uppercase tracking-[0.08em] text-black transition-colors hover:bg-lavender"
            >
              Concerts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
