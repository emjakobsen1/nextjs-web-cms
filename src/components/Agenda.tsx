import type { AgendaItem } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Agenda({ agenda }: { agenda: AgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <section id="agenda" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Agenda
        </Reveal>

        <ul className="mt-10 divide-y divide-line md:mt-14">
          {agenda.map((event, i) => (
            <Reveal as="li" key={event._id} delay={(i % 4) * 60}>
              <div className="group relative -mx-3 flex flex-col gap-1 px-3 py-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-surface hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] md:-mx-4 md:flex-row md:items-center md:gap-6 md:px-4 md:py-6">
                <span className="text-base font-light italic md:w-24">
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span className="text-lg uppercase tracking-tight md:w-56">{event.title}</span>
                <span className="text-muted md:flex-1">{event.location}</span>
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
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
