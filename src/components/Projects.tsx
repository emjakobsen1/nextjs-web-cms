"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Project } from "@/sanity/queries";
import { useAdaptiveInks } from "@/hooks/useAdaptiveInks";
import Reveal from "./Reveal";
import FlushLeftLine from "./FlushLeftLine";

// So closing a project reached from here lands back on this section,
// instead of the top of the homepage.
const PROJECTS_SECTION = "/#projects";

export default function Projects({ projects }: { projects: Project[] }) {
  const { setRef: setInkRef, inkClasses } = useAdaptiveInks(projects.length);

  if (!projects.length) return null;

  return (
    <section id="projects" className="py-10 md:py-16">
      <div className="px-1 md:px-1.5">
        <div className="mx-auto flex max-w-[1800px] items-baseline justify-between">
          <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
            Projects
          </Reveal>
          <Reveal>
            <Link
              href="/releases"
              className="text-sm font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              View All &rarr;
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:mt-6 sm:grid-cols-2">
        {projects.map((project, i) => {
          const imageUrl = project.coverImage
            ? urlFor(project.coverImage)?.width(1600).height(1600).url()
            : null;
          return (
            <Reveal key={project._id}>
              <Link
                href={`/projects/${project.slug.current}?from=${encodeURIComponent(PROJECTS_SECTION)}`}
                className="group relative block aspect-square w-full overflow-hidden bg-surface"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="photo object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : null}
                <FlushLeftLine
                  text={project.title.toUpperCase()}
                  spanRef={setInkRef(i)}
                  className={`pointer-events-none absolute bottom-0 left-0 block text-[10vw] leading-[0.8] font-light tracking-tight transition-colors duration-300 sm:text-[4.5vw] ${inkClasses[i]}`}
                />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
