import Image from "next/image";

const RELEASES = [
  {
    title: "Nordlys",
    meta: "Trio Album · 2024",
    description:
      "Recorded live in one take over a single Copenhagen night, moving between written heads and long stretches of open, listening improvisation.",
    image:
      "https://images.unsplash.com/photo-1738235870356-580cf652ada8?q=80&w=1000&auto=format&fit=crop",
    alt: "Close-up of a drum kit in low light",
    chip: "bg-lavender",
  },
  {
    title: "Modlys",
    meta: "Duo Improvisations · 2025",
    description:
      "Fully improvised duo recordings with double bass, made without rehearsal — the sound of two players finding a room's silence together.",
    image:
      "https://plus.unsplash.com/premium_photo-1677446657603-67e209c5bf41?q=80&w=1000&auto=format&fit=crop",
    alt: "A double bass against a dark background",
    chip: "bg-cream",
  },
  {
    title: "Live at Blå Time",
    meta: "Live Recording · 2026",
    description:
      "Two late sets at a small Copenhagen room, loose and unedited — closer to how the trio actually sounds with an audience in the room.",
    image:
      "https://images.unsplash.com/photo-1623123776919-e5208e9b0b47?q=80&w=1000&auto=format&fit=crop",
    alt: "A golden saxophone resting on a sheet of music",
    chip: "bg-lavender",
  },
  {
    title: "Stille Rum",
    meta: "Solo Piano · 2023",
    description:
      "A quiet, unaccompanied session recorded overnight in an empty hall, built around space, sustain and the sound of the room itself.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000&auto=format&fit=crop",
    alt: "Close-up of piano keys",
    chip: "bg-cream",
  },
  {
    title: "Late Sessions",
    meta: "Full Band Live Album · 2022",
    description:
      "Highlights from a year of late-night club dates, compiled into one set — the band stretching out on familiar heads night after night.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop",
    alt: "A band performing live on a dark stage",
    chip: "bg-lavender",
  },
  {
    title: "Enrum",
    meta: "EP · 2021",
    description:
      "Four short studio pieces written for a single afternoon session — sparse arrangements, minimal overdubs, first takes kept throughout.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
    alt: "A trumpet resting on a stool in a studio",
    chip: "bg-cream",
  },
];

const LISTEN_LINKS = ["Bandcamp", "Spotify"];

export default function Releases() {
  return (
    <section id="releases" className="px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <Image
          src="/images/releases-removebg-preview.png"
          alt="Releases"
          width={299}
          height={81}
          className="ink-fat h-[2.24rem] w-auto md:h-[3.36rem]"
        />

        <div className="mt-8 flex flex-col gap-10 md:mt-10 md:gap-16">
          {RELEASES.map((release, i) => (
            <div
              key={release.title}
              className={`flex flex-col gap-6 md:items-center md:gap-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden md:w-1/2">
                <Image
                  src={release.image}
                  alt={release.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="photo object-cover"
                />
              </div>

              <div className="md:w-1/2">
                <span
                  className={`inline-block border border-black/15 ${release.chip} px-3 py-1 text-xs uppercase tracking-[0.12em] text-black`}
                >
                  {release.meta}
                </span>
                <h3 className="mt-3 text-4xl font-normal uppercase tracking-tight md:text-5xl">
                  {release.title}
                </h3>
                <p className="mt-5 max-w-md text-muted">
                  {release.description}
                </p>

                <ul className="mt-7 flex flex-wrap gap-3">
                  {LISTEN_LINKS.map((service) => (
                    <li key={service}>
                      <a
                        href="#"
                        className="inline-block border border-black/25 px-5 py-2.5 text-sm uppercase tracking-[0.1em] transition-colors hover:border-black hover:bg-black hover:text-white"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
