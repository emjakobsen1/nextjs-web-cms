import type { AgendaItem } from "@/sanity/queries";
import Reveal from "./Reveal";
import AgendaList from "./AgendaList";

export default function Agenda({ agenda }: { agenda: AgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <section id="agenda" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Agenda
        </Reveal>

        <div className="mt-4 md:mt-6">
          <AgendaList agenda={agenda} />
        </div>
      </div>
    </section>
  );
}
