import Image from "next/image";

const RELEASES = [
  {
    title: "Nordlys",
    meta: "Trio Album · 2024",
    description:
      "Recorded live in one take over a single Copenhagen night. Nordlys moves between written heads and long stretches of open, listening improvisation.",
    image:
      "https://images.unsplash.com/photo-1738235870356-580cf652ada8?q=80&w=1400&auto=format&fit=crop",
    alt: "Close-up of a drum kit in low light",
    chip: "bg-lavender",
  },
  {
    title: "Modlys",
    meta: "Duo Improvisations · 2025",
    description:
      "A set of fully improvised duo recordings with double bass, made without rehearsal. Modlys is the sound of two players finding a room's silence together.",
    image:
      "https://plus.unsplash.com/premium_photo-1677446657603-67e209c5bf41?q=80&w=1400&auto=format&fit=crop",
    alt: "A double bass against a dark background",
    chip: "bg-cream",
  },
  {
    title: "Live at Blå Time",
    meta: "Live Recording · 2026",
    description:
      "Captured over two late sets at a small Copenhagen room. Loose, unedited, and closer to how the trio actually sounds in a room with an audience.",
    image:
      "https://images.unsplash.com/photo-1623123776919-e5208e9b0b47?q=80&w=1400&auto=format&fit=crop",
    alt: "A golden saxophone resting on a sheet of music",
    chip: "bg-lavender",
  },
];

const LISTEN_LINKS = ["Bandcamp", "Spotify"];

export default function Releases() {
  return (
    <section id="releases" className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Image
          src="/images/releases-removebg-preview.png"
          alt="Releases"
          width={299}
          height={81}
          className="ink-fat h-16 w-auto md:h-24"
        />

        <div className="mt-8 flex flex-col gap-10 md:mt-10 md:gap-16">
          {RELEASES.map((release, i) => (
            <div
              key={release.title}
              className={`flex flex-col gap-6 md:items-center md:gap-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden md:w-1/2">
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
