import type { AgendaItem } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function AgendaList({ agenda }: { agenda: AgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <ul className="divide-y divide-line px-2 text-lg md:px-3">
      {agenda.map((event, i) => (
        <Reveal as="li" key={event._id} delay={(i % 4) * 60}>
          <div className="group relative -mx-2 flex flex-col gap-1 px-2 py-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-accent/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] md:-mx-3 md:flex-row md:items-center md:gap-6 md:px-3 md:py-6">
            <span className="text-lg font-light italic md:w-24">
              {new Date(event.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <span className="text-xl uppercase tracking-tight md:w-56">{event.title}</span>
            <span className="text-muted md:flex-1">{event.location}</span>
            {event.link ? (
              <a
                href={event.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-fit border border-fg/25 px-5 py-2 text-sm uppercase tracking-[0.1em] transition-colors hover:border-accent hover:bg-accent hover:text-fg"
              >
                Details
              </a>
            ) : null}
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
