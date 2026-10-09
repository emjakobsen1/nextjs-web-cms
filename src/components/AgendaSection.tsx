"use client";

import { useMemo, useState } from "react";
import type { AgendaItem } from "@/sanity/queries";
import Reveal from "./Reveal";
import AgendaList from "./AgendaList";

type Tab = "upcoming" | "past";

// Shared by the homepage agenda and each project page's own agenda: a
// top-left Upcoming/Past switch over the same list component, splitting and
// re-sorting whatever events it's given rather than relying on the query to
// have already filtered by date.
export default function AgendaSection({
  agenda,
  heading = "Agenda",
}: {
  agenda: AgendaItem[];
  heading?: string;
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [now] = useState(() => Date.now());

  const { upcoming, past } = useMemo(() => {
    const upcoming = agenda
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = agenda
      .filter((event) => new Date(event.date).getTime() < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcoming, past };
  }, [agenda, now]);

  if (!agenda.length) return null;

  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          {heading}
        </Reveal>

        <div role="tablist" aria-label="Show dates" className="flex items-center gap-2 text-sm tracking-[0.1em]">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
            className={`transition-colors ${tab === "upcoming" ? "text-accent" : "text-muted hover:text-fg"}`}
          >
            Upcoming
          </button>
          <span aria-hidden className="text-muted">
            |
          </span>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
            className={`transition-colors ${tab === "past" ? "text-accent" : "text-muted hover:text-fg"}`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        {shown.length ? (
          <AgendaList agenda={shown} />
        ) : (
          <p className="px-2 py-6 text-muted md:px-3">
            {tab === "upcoming" ? "No upcoming shows." : "No past shows."}
          </p>
        )}
      </div>
    </div>
  );
}
