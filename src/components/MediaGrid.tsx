"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { ReleaseMediaItem } from "@/sanity/queries";
import { useWaveClip } from "@/components/ScrollWaveProvider";
import { toEmbedUrl } from "@/lib/videoEmbed";

// Landscape images wide enough to look cramped next to a partner get their
// own full-bleed row, up front, instead of being forced side by side.
const WIDE_RATIO_THRESHOLD = 1.2;

function isWide(item: ReleaseMediaItem) {
  // Videos don't carry known dimensions — treat them like a wide/landscape
  // shot so they always get their own full-bleed row instead of being
  // squeezed into a half-width pair slot sized for a photo.
  if (item.mediaType === "video") return true;
  if (!item.width || !item.height) return false;
  return item.width / item.height >= WIDE_RATIO_THRESHOLD;
}

function FinalNote({ note, wide }: { note: string; wide?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center p-8 text-center text-sm whitespace-pre-line text-muted ${
        wide ? "py-16" : "aspect-[2/3]"
      }`}
    >
      {note}
    </div>
  );
}

function WaveMediaItem({
  item,
  waveKey,
  edges,
  sizes = "50vw",
}: {
  item: ReleaseMediaItem;
  waveKey: string;
  edges: { left: boolean; right: boolean };
  sizes?: string;
}) {
  // Videos don't get the scroll-wave clip — only photos do — so the ref is
  // only attached in the image branch below.
  const waveRef = useWaveClip(waveKey, edges, { baseInset: 6, amplitude: 2 });

  if (item.mediaType === "video") {
    const embedUrl = item.videoUrl ? toEmbedUrl(item.videoUrl) : null;
    if (!embedUrl) return null;
    return (
      <div className="relative aspect-video w-full self-start overflow-hidden bg-surface">
        <iframe
          src={embedUrl}
          title={item.alt ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="photo absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const src = item.image ? urlFor(item.image)?.width(1600).url() : null;
  if (!src || !item.width || !item.height) return null;

  return (
    <div ref={waveRef} className="relative w-full self-start overflow-hidden bg-surface">
      <Image
        src={src}
        alt={item.alt ?? ""}
        width={item.width}
        height={item.height}
        sizes={sizes}
        className="photo block h-auto w-full"
      />
    </div>
  );
}

export default function MediaGrid({
  media,
  finalNote,
}: {
  media: ReleaseMediaItem[];
  finalNote?: string;
}) {
  // Widescreen images always lead, each on its own full-bleed row. The rest
  // pair up two-per-row in the order they were authored; a leftover odd one
  // out gets the final description as its right-hand partner instead of
  // sitting alone.
  const indexed = media.map((item, i) => ({ item, key: `media-${i}` }));
  const wideEntries = indexed.filter(({ item }) => isWide(item));
  const normalEntries = indexed.filter(({ item }) => !isWide(item));

  const isNormalCountOdd = normalEntries.length % 2 === 1;
  const finalNoteFillsSlot = Boolean(finalNote) && isNormalCountOdd;

  const pairs: (typeof normalEntries)[] = [];
  for (let i = 0; i < normalEntries.length; i += 2) {
    pairs.push(normalEntries.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {wideEntries.map(({ item, key }) => (
        <WaveMediaItem key={key} item={item} waveKey={key} edges={{ left: true, right: true }} sizes="100vw" />
      ))}

      {pairs.map((pair, pairIndex) => {
        const isLastPair = pairIndex === pairs.length - 1;

        if (pair.length === 2) {
          return (
            <div key={pair[0].key} className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <WaveMediaItem item={pair[0].item} waveKey={pair[0].key} edges={{ left: true, right: false }} sizes="(min-width: 640px) 50vw, 100vw" />
              <WaveMediaItem item={pair[1].item} waveKey={pair[1].key} edges={{ left: false, right: true }} sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          );
        }

        // Odd one out.
        if (isLastPair && finalNoteFillsSlot) {
          return (
            <div key={pair[0].key} className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <WaveMediaItem item={pair[0].item} waveKey={pair[0].key} edges={{ left: true, right: true }} sizes="(min-width: 640px) 50vw, 100vw" />
              <FinalNote note={finalNote!} />
            </div>
          );
        }

        return (
          <div key={pair[0].key} className="w-full sm:mx-auto sm:w-1/2">
            <WaveMediaItem item={pair[0].item} waveKey={pair[0].key} edges={{ left: true, right: true }} sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
        );
      })}

      {finalNote && !finalNoteFillsSlot && <FinalNote note={finalNote} wide />}
    </div>
  );
}
