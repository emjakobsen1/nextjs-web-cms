import type { AgendaItem } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Agenda({ agenda }: { agenda: AgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <section id="agenda" className="border-t border-line px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Shows
        </Reveal>

        <ul className="mt-10 divide-y divide-line md:mt-14">
          {agenda.map((event, i) => (
            <Reveal
              as="li"
              key={event._id}
              delay={(i % 4) * 60}
              className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:gap-6 md:py-6"
            >
              <span className="text-lg font-light italic md:w-40">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <span className="flex-1 text-lg uppercase tracking-tight md:text-xl">
                {event.title}
                <span className="text-muted"> &mdash; {event.location}</span>
              </span>
              {event.link ? (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block w-fit border border-fg/25 px-5 py-2 text-sm uppercase tracking-[0.1em] transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                >
                  Tickets
                </a>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
