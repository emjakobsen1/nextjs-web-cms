"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ReleaseSummary } from "@/sanity/queries";
import { RELEASE_TYPE_LABELS } from "@/lib/releaseType";
import Reveal from "./Reveal";

type SortKey = "year" | "title" | "project";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "year", label: "Year" },
  { key: "title", label: "A–Z" },
  { key: "project", label: "Project" },
];

function sortReleases(releases: ReleaseSummary[], key: SortKey): ReleaseSummary[] {
  const sorted = [...releases];
  switch (key) {
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "project":
      sorted.sort(
        (a, b) =>
          (a.project?.title ?? "").localeCompare(b.project?.title ?? "") || a.title.localeCompare(b.title),
      );
      break;
    case "year":
    default:
      // Most recent first, undated releases sink to the bottom rather than
      // the top.
      sorted.sort((a, b) => (b.releaseDate ?? "0000").localeCompare(a.releaseDate ?? "0000"));
      break;
  }
  return sorted;
}

export default function ReleasesIndex({ releases }: { releases: ReleaseSummary[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const sorted = useMemo(() => sortReleases(releases, sortKey), [releases, sortKey]);

  return (
    <div className="pt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-4 sm:px-6">
        <Reveal as="h1" className="text-2xl font-light tracking-wide text-accent uppercase sm:text-3xl">
          All Releases
        </Reveal>

        <Reveal className="flex items-baseline gap-5 text-sm uppercase tracking-[0.2em]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortKey(option.key)}
              aria-pressed={sortKey === option.key}
              className={`transition-colors ${
                sortKey === option.key ? "text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {option.label}
            </button>
          ))}
        </Reveal>
      </div>

      <ul className="mt-10 divide-y divide-line px-2 text-lg sm:mt-14 sm:px-4">
        {sorted.map((release, i) => {
          const year = release.releaseDate ? new Date(release.releaseDate).getFullYear() : null;
          return (
            <Reveal as="li" key={release._id} delay={(i % 8) * 40}>
              <Link
                href={`/releases/${release.slug.current}?from=/releases`}
                className="group relative -mx-2 flex flex-col gap-1 px-2 py-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-accent/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] sm:-mx-4 sm:flex-row sm:items-center sm:gap-6 sm:px-4 sm:py-6"
              >
                <span className="text-xl uppercase tracking-tight sm:flex-1">{release.title}</span>
                <span className="text-muted sm:w-56">{release.project?.title ?? "—"}</span>
                <span className="text-muted sm:w-20">
                  {release.releaseType ? RELEASE_TYPE_LABELS[release.releaseType] : "—"}
                </span>
                <span className="text-muted sm:w-20 sm:text-right">{year ?? "—"}</span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
