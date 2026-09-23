import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="px-4 py-5 md:px-6 md:py-8">
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
            className="ink-fat h-[2.24rem] w-auto md:h-[3.92rem]"
          />
          <p className="mt-6 text-2xl font-light italic leading-snug tracking-tight text-black md:text-3xl">
            &ldquo;I&rsquo;m less interested in the right note than the room
            deciding what happens next.&rdquo;
          </p>
          <p className="mt-6 max-w-lg text-muted">
        Jesper Lørup (f. 1995) er en ung trommeslager og komponist, som er uddannet hhv. Danmark og Holland. Hans spil rummer et højt niveau af sensibilitet og lydhørhed, som medfører at han indgår i flere internationale projekter, med turnéer flere steder i Europa.




I 2022 dannede han bandet HI FI Quartet, hvor musikken er inspireret af den europæiske jazzscene, og er et møde mellem stærke melodier og kreative formstrukturer. Kompositionerne er skabt ud fra idéen om at give de medvirkende musikere en høj grad af kreativ frihed, så der gives plads til at hver musiker kan udfolde sig individuelt, samtidig med at musikken bevæger sig i en klar retning.




På det kommende debutalbum, Sketches From The Black Box, inviteres lytteren ind i et kreativt og dybt personligt univers, hvor musikken skabes i mødet mellem stærke temaer og kollektive improvisationer, med plads til både følsomme numre og unikt sammenspil med høj intensitet.

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
