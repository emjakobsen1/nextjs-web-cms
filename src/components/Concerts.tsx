import Image from "next/image";

const CONCERTS = [
  {
    date: "Aug 14",
    city: "Copenhagen, DK",
    venue: "Jazzhus Montmartre",
    status: "Tickets",
  },
  {
    date: "Aug 22",
    city: "Berlin, DE",
    venue: "A-Trane",
    status: "Tickets",
  },
  {
    date: "Sep 03",
    city: "Amsterdam, NL",
    venue: "Bimhuis",
    status: "Sold out",
  },
  {
    date: "Sep 19",
    city: "London, UK",
    venue: "Ronnie Scott's",
    status: "Tickets",
  },
];

export default function Concerts() {
  return (
    <section id="concerts" className="border-y border-line px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Image
          src="/images/concerts-removebg-preview.png"
          alt="Concerts"
          width={239}
          height={57}
          className="ink-fat h-16 w-auto md:h-24"
        />

        <ul className="mt-8 divide-y divide-line">
          {CONCERTS.map((concert) => (
            <li
              key={concert.date + concert.city}
              className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:gap-6 md:py-6"
            >
              <span className="text-xl font-light italic md:w-28">
                {concert.date}
              </span>
              <span className="flex-1 text-xl uppercase tracking-tight md:text-2xl">
                {concert.city}
                <span className="text-muted"> &mdash; {concert.venue}</span>
              </span>
              <a
                href="#"
                aria-disabled={concert.status === "Sold out"}
                className={`inline-block w-fit border px-5 py-2 text-sm uppercase tracking-[0.1em] transition-colors ${
                  concert.status === "Sold out"
                    ? "cursor-not-allowed border-line text-muted"
                    : "border-black/25 hover:border-black hover:bg-black hover:text-white"
                }`}
              >
                {concert.status}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
