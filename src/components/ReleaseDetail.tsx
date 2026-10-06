"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { ReleaseDetail as ReleaseDetailData, ReleaseSummary } from "@/sanity/queries";
import MediaGrid from "@/components/MediaGrid";
import Sponsors from "@/components/Sponsors";
import SocialIcon, { PLATFORM_LABELS } from "@/components/SocialIcon";
import NextReleaseFooter from "@/components/NextReleaseFooter";
import ScrollWaveProvider, { useWaveClip } from "@/components/ScrollWaveProvider";
import { toEmbedUrl } from "@/lib/videoEmbed";
import { linktreeFirst } from "@/lib/socialLinks";
import { RELEASE_TYPE_LABELS } from "@/lib/releaseType";

// The large hero-style cover at the top of the release page. Defaults to
// the release's Image field, but a media item marked "Use as title image"
// (in Studio) takes over instead — image or video.
function Cover({
  videoUrl,
  imageUrl,
  alt,
}: {
  videoUrl?: string;
  imageUrl?: string;
  alt: string;
}) {
  // Videos don't get the scroll-wave clip — only photos do — so the ref is
  // only attached in the image branch below.
  const waveRef = useWaveClip("hero", { left: true, right: true }, { baseInset: 5, amplitude: 2 });

  if (videoUrl) {
    const embedUrl = toEmbedUrl(videoUrl);
    if (!embedUrl) return null;
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        <iframe
          src={embedUrl}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="photo absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div ref={waveRef} className="relative aspect-square w-full overflow-hidden bg-surface">
      <Image src={imageUrl} alt={alt} fill sizes="80vw" priority className="photo object-cover" />
    </div>
  );
}

export default function ReleaseDetail({
  release,
  releases,
  originHref,
}: {
  release: ReleaseDetailData;
  releases: ReleaseSummary[];
  originHref: string;
}) {
  const titleMedia = release.media?.find((item) => item.isTitleImage);
  const galleryMedia = release.media?.filter((item) => !item.isTitleImage) ?? [];

  const titleVideoUrl = titleMedia?.mediaType === "video" ? titleMedia.videoUrl : undefined;
  const titleImageUrl =
    titleMedia?.mediaType === "image" && titleMedia.image
      ? urlFor(titleMedia.image)?.width(1600).height(1600).url()
      : undefined;
  const fallbackImageUrl = urlFor(release.image)?.width(1600).height(1600).url();
  const links = linktreeFirst(release.links ?? []);
  // The cover photo's click-through should go to somewhere to actually
  // listen, not a Linktree directory — even though Linktree now displays
  // first in the button row below.
  const primaryLink = links.find((link) => link.platform !== "linktree") ?? links[0];

  const cover = (
    <Cover
      videoUrl={titleVideoUrl}
      imageUrl={titleImageUrl ?? fallbackImageUrl ?? undefined}
      alt={release.title}
    />
  );
  const year = release.releaseDate ? new Date(release.releaseDate).getFullYear() : null;

  return (
    <ScrollWaveProvider>
      <div className="pt-28">
        <div className="flex flex-col items-stretch gap-4 sm:grid sm:grid-cols-[10%_80%_10%] sm:items-center sm:gap-0">
          <div className="order-1 flex items-baseline justify-between gap-4 px-4 sm:contents">
            <div className="sm:px-6">
              <h1 className="text-2xl font-light tracking-wide text-accent uppercase sm:text-3xl">
                {release.title}
              </h1>
              {release.releaseType ? (
                <p className="mt-1 text-base text-fg sm:text-lg">
                  ({RELEASE_TYPE_LABELS[release.releaseType]})
                </p>
              ) : null}
            </div>
            {year ? (
              <p className="shrink-0 text-lg font-medium tracking-wide text-fg/60 sm:order-3 sm:px-6 sm:text-right sm:text-3xl sm:text-fg">
                {year}
              </p>
            ) : null}
          </div>

          <div className="order-2">
            {primaryLink ? (
              <a href={primaryLink.url} target="_blank" rel="noopener noreferrer" className="group block">
                {cover}
              </a>
            ) : (
              cover
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 px-4 text-lg sm:mt-24 sm:grid-cols-4 sm:gap-8 sm:px-6">
          {release.length ? (
            <div>
              <p className="mb-2 font-semibold tracking-wide uppercase">Duration</p>
              <p className="text-muted">{release.length}</p>
            </div>
          ) : null}

          {release.personnel?.length ? (
            <div>
              <p className="mb-2 font-semibold tracking-wide uppercase">Personnel</p>
              <p className="whitespace-pre-line text-muted">{release.personnel.join("\n")}</p>
            </div>
          ) : null}

          {release.description ? (
            <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:gap-6">
              <p className="shrink-0 font-semibold tracking-wide uppercase">(Info)</p>
              <p className="text-muted sm:indent-8">{release.description}</p>
            </div>
          ) : null}
        </div>

        {links.length ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 px-4 sm:px-6">
            {links.map((link, i) => {
              // Same button as the rest of the row — just white instead of
              // salmon and bolder, so a Linktree (a directory of all the
              // others) still reads as a little distinct without breaking
              // from the shared button shape.
              const isLinktree = link.platform === "linktree";
              return (
                <a
                  key={`${link.platform}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 border border-accent/60 px-8 py-4 text-base uppercase tracking-[0.15em] transition-colors hover:text-black ${
                    isLinktree ? "font-bold text-white hover:bg-white" : "text-accent hover:bg-accent"
                  }`}
                >
                  <SocialIcon platform={link.platform} className={isLinktree ? "h-5 w-5 stroke-2" : "h-5 w-5"} />
                  {PLATFORM_LABELS[link.platform] ?? link.platform}
                </a>
              );
            })}
          </div>
        ) : null}

        <div className="mt-16 sm:mt-24">
          <MediaGrid media={galleryMedia} finalNote={release.finalNote} />
        </div>

        {release.sponsors?.length ? (
          <div className="mt-16 flex flex-col gap-4 px-4 text-lg sm:mt-24 sm:flex-row sm:items-start sm:gap-8 sm:px-6">
            <p className="shrink-0 font-semibold tracking-wide uppercase">Sponsored by</p>
            <Sponsors sponsors={release.sponsors} />
          </div>
        ) : null}

        <NextReleaseFooter releases={releases} currentSlug={release.slug.current} originHref={originHref} />
      </div>
    </ScrollWaveProvider>
  );
}
