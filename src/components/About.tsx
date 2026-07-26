import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-16">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src="https://images.unsplash.com/photo-1746688384431-53d96bbf6417?q=80&w=1200&auto=format&fit=crop"
            alt="Jesper Lørup performing live, mid-hit on the kit"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="photo object-cover"
          />
        </div>

        <div>
          <Image
            src="/images/about-removebg-preview.png"
            alt="About"
            width={223}
            height={93}
            className="ink-fat h-16 w-auto md:h-28"
          />
          <p className="mt-6 text-2xl font-light italic leading-snug tracking-tight text-black md:text-3xl">
            &ldquo;I&rsquo;m less interested in the right note than the room
            deciding what happens next.&rdquo;
          </p>
          <p className="mt-6 max-w-lg text-muted">
            Jesper L&oslash;rup is a drummer based in Copenhagen, working
            across jazz, free improvisation and experimental live music.
            Equally at home behind a written arrangement or an entirely
            open set, his playing favours texture and restraint over
            volume &mdash; brushes as often as sticks, silence treated as
            an instrument in its own right. He performs regularly in trio
            and duo settings and as a sideman across the European
            improvised music scene.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-block bg-black px-6 py-3 text-sm uppercase tracking-[0.1em] text-white transition-colors hover:bg-lavender hover:text-black"
          >
            Full bio &amp; press kit
          </a>
        </div>
      </div>
    </section>
  );
}
