import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      <Image
        src="/images/jesper-loerup-hero2.png"
        alt="Jesper Lørup playing drums live, with double bass in the background"
        fill
        priority
        sizes="100vw"
        className="photo object-cover object-[top_2.25rem]"
      />
      <div className="hero-fade absolute inset-0" />

      <div className="relative w-full px-4 pb-[6vh] md:px-6 md:pb-[4vh]">
        <div className="mx-auto max-w-6xl">
          <h1 className="scale-y-110 whitespace-nowrap text-[clamp(0.8rem,3.8vw,3rem)] font-thin uppercase leading-[0.92] tracking-tight text-white origin-bottom-left">
            Jesper L&oslash;rup // Drummer &amp; Composer
          </h1>

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
