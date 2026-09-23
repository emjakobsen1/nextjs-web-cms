import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/image";
import { getReleaseBySlug } from "@/sanity/queries";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return {};
  return { title: release.title, description: release.description };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) notFound();

  const imageUrl = release.image
    ? urlFor(release.image)?.width(1400).height(1400).url()
    : null;

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 md:px-6 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/#projects" className="text-sm uppercase tracking-[0.1em] text-muted hover:text-fg">
          &larr; Back to music
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="relative aspect-square w-full overflow-hidden bg-surface">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={release.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                className="photo object-cover"
              />
            ) : null}
          </Reveal>

          <div>
            {release.project ? (
              <Reveal as="p" className="text-sm uppercase tracking-[0.15em] text-muted">
                {release.project.title}
              </Reveal>
            ) : null}
            <Reveal as="h1" delay={60} className="mt-2 text-4xl uppercase tracking-tight md:text-5xl">
              {release.title}
            </Reveal>

            <Reveal delay={120} className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              {release.releaseDate ? (
                <span>{new Date(release.releaseDate).getFullYear()}</span>
              ) : null}
              {release.length ? <span>{release.length}</span> : null}
            </Reveal>

            {release.description ? (
              <Reveal delay={180} as="p" className="mt-8 max-w-md text-muted">
                {release.description}
              </Reveal>
            ) : null}

            {release.personnel?.length ? (
              <Reveal delay={240} className="mt-8">
                <h2 className="text-sm uppercase tracking-[0.15em] text-muted">Personnel</h2>
                <ul className="mt-3 space-y-1">
                  {release.personnel.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {release.link ? (
              <Reveal delay={300} className="mt-10">
                <a
                  href={release.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-fg px-7 py-3.5 text-sm uppercase tracking-[0.1em] text-bg transition-colors hover:bg-fg/80"
                >
                  Listen
                </a>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
