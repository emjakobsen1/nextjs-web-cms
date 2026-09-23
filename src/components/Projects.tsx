import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Project } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Music
        </Reveal>

        <div className="mt-10 flex flex-col gap-16 md:mt-14 md:gap-24">
          {projects.map((project) => (
            <div key={project._id}>
              <Reveal as="h3" className="text-3xl uppercase tracking-tight md:text-4xl">
                {project.title}
              </Reveal>
              {project.description ? (
                <Reveal delay={80} className="mt-3 max-w-lg text-muted">
                  {project.description}
                </Reveal>
              ) : null}

              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {project.releases.map((release, i) => {
                  const imageUrl = release.image
                    ? urlFor(release.image)?.width(800).height(800).url()
                    : null;
                  return (
                    <Reveal key={release._id} delay={(i % 3) * 80}>
                      <Link href={`/releases/${release.slug.current}`} className="group block">
                        <div className="relative aspect-square w-full overflow-hidden bg-surface">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={release.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="photo object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : null}
                        </div>
                        <h4 className="mt-4 text-lg uppercase tracking-tight">{release.title}</h4>
                        {release.length ? (
                          <p className="mt-1 text-sm text-muted">{release.length}</p>
                        ) : null}
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
