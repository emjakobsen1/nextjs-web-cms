import type { AgendaItem } from "@/sanity/queries";
import AgendaSection from "./AgendaSection";

export default function Agenda({ agenda }: { agenda: AgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <section id="agenda" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <AgendaSection agenda={agenda} />
      </div>
    </section>
  );
}
