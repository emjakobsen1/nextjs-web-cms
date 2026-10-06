"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { ProjectDetail as ProjectDetailData } from "@/sanity/queries";
import { useAdaptiveInks } from "@/hooks/useAdaptiveInks";
import { linktreeFirst } from "@/lib/socialLinks";
import Reveal from "./Reveal";
import AgendaList from "./AgendaList";
import SocialIcon, { PLATFORM_LABELS } from "./SocialIcon";
import FlushLeftLine from "./FlushLeftLine";

export default function ProjectDetail({ project }: { project: ProjectDetailData }) {
  const imageUrl = project.coverImage
    ? urlFor(project.coverImage)?.width(1920).height(1200).url()
    : null;
  const originHref = `/projects/${project.slug.current}`;
  const socialLinks = linktreeFirst(project.socialLinks ?? []);
  const { setRef: setInkRef, inkClasses } = useAdaptiveInks(1);

  return (
    <div>
      {/* A card-that's-been-expanded: full-bleed like the homepage hero, but
          capped well short of its height so it still reads as this page's
          title rather than a second hero. Runs flush to the top of the
          viewport, under the fixed header, the same way the homepage hero
          does. */}
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden bg-surface sm:h-[60vh]">
        {imageUrl ? (
          <Image src={imageUrl} alt={project.title} fill sizes="100vw" priority className="photo object-cover" />
        ) : null}
        <FlushLeftLine
          text={project.title.toUpperCase()}
          spanRef={setInkRef(0)}
          className={`pointer-events-none absolute bottom-0 left-0 block text-[11vh] leading-[0.8] font-light tracking-tight uppercase transition-colors duration-300 ${inkClasses[0]}`}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 px-4 sm:grid-cols-2 sm:gap-0 sm:px-6">
        {project.description ? (
          <p className="max-w-2xl text-lg text-muted">{project.description}</p>
        ) : null}

        {socialLinks.length ? (
          <ul className="flex flex-wrap items-center gap-3">
            {socialLinks.map(({ platform, url }) => {
              // Same button as the release page's listen links — Linktree
              // (a directory of all the others) in plain white and bolder,
              // so it still reads as a little distinct from the rest.
              const isLinktree = platform === "linktree";
              return (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-3 border border-accent/60 px-8 py-4 text-base uppercase tracking-[0.15em] transition-colors hover:text-black ${
                      isLinktree ? "font-bold text-white hover:bg-white" : "text-accent hover:bg-accent"
                    }`}
                  >
                    <SocialIcon platform={platform} className={isLinktree ? "h-5 w-5 stroke-2" : "h-5 w-5"} />
                    {PLATFORM_LABELS[platform] ?? platform}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {project.agenda.length ? (
        <div className="mt-16 sm:mt-24">
          <Reveal as="h2" className="px-4 text-sm uppercase tracking-[0.2em] text-muted sm:px-6">
            Upcoming
          </Reveal>
          <div className="mt-4 md:mt-6">
            <AgendaList agenda={project.agenda} />
          </div>
        </div>
      ) : null}

      {project.releases.length ? (
        <div className="mt-16 px-4 sm:mt-24 sm:px-6">
          <p className="mb-6 text-sm font-semibold tracking-wide uppercase">Releases</p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {project.releases.map((release) => {
              const releaseImageUrl = release.image
                ? urlFor(release.image)?.width(800).height(800).url()
                : null;
              const year = release.releaseDate ? new Date(release.releaseDate).getFullYear() : null;
              return (
                <Link
                  key={release._id}
                  href={`/releases/${release.slug.current}?from=${encodeURIComponent(originHref)}`}
                  className="group block"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-surface">
                    {releaseImageUrl ? (
                      <Image
                        src={releaseImageUrl}
                        alt={release.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="photo object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <h4 className="mt-4 text-lg tracking-tight uppercase">{release.title}</h4>
                  {release.length || year ? (
                    <div className="mt-1 flex items-center justify-between text-sm text-muted">
                      <span>{release.length}</span>
                      <span>{year}</span>
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
