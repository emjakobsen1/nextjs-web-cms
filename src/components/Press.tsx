import type { Press as PressData } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Press({ press }: { press: PressData | null }) {
  if (!press) return null;

  const hasQuotes = Boolean(press.quotes?.length);
  const pressKitUrl = press.pressKit?.asset?.url;

  if (!hasQuotes && !pressKitUrl) return null;

  return (
    <section id="press" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Press
        </Reveal>

        {hasQuotes ? (
          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
            {press.quotes!.map((q, i) => (
              <Reveal key={i} delay={(i % 2) * 100}>
                <p className="text-xl font-light italic leading-snug tracking-tight md:text-2xl">
                  &ldquo;{q.quote}&rdquo;
                </p>
                {q.source ? (
                  <p className="mt-3 text-sm uppercase tracking-[0.1em] text-muted">{q.source}</p>
                ) : null}
              </Reveal>
            ))}
          </div>
        ) : null}

        {pressKitUrl ? (
          <Reveal delay={120} className="mt-12">
            <a
              href={pressKitUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-fg px-6 py-3 text-sm uppercase tracking-[0.1em] text-bg transition-colors hover:bg-fg/80"
            >
              Download press kit
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
