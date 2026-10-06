import type { Press as PressData } from "@/sanity/queries";
import Reveal from "./Reveal";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" />
      <path d="M4.5 16.5V19a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
    </svg>
  );
}

export default function Press({ press }: { press: PressData | null }) {
  if (!press) return null;

  const hasQuotes = Boolean(press.quotes?.length);
  const pressKitUrl = press.pressKit?.asset?.url;
  const pressKitExtension = press.pressKit?.asset?.originalFilename?.split(".").pop();

  if (!hasQuotes && !pressKitUrl) return null;

  const pressKitButton = pressKitUrl ? (
    <Reveal delay={120} className="mt-12 flex justify-center">
      <a
        href={pressKitUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 border border-fg/25 px-6 py-3 text-base uppercase tracking-[0.1em] transition-colors hover:border-accent hover:bg-accent hover:text-fg"
      >
        <DownloadIcon className="h-5 w-5" />
        Download press kit{pressKitExtension ? ` (.${pressKitExtension})` : ""}
      </a>
    </Reveal>
  ) : null;

  return (
    <section id="press" className="px-1 py-6 md:px-1.5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-muted">
          Press
        </Reveal>

        {hasQuotes ? (
          // The quotes, and the press kit link that follows them, sit in a
          // much narrower column than the rest of the page — roughly the
          // center 50%, 25% margin either side — so the reader isn't tracking
          // full-width lines of pull-quote text.
          <div className="mt-10 md:mx-auto md:mt-14 md:w-1/2">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
              {press.quotes!.map((q, i) => (
                <Reveal key={i} delay={(i % 2) * 100}>
                  <p className="text-xl leading-snug tracking-tight md:text-2xl">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  {q.source ? (
                    <p className="mt-3 text-sm uppercase tracking-[0.1em] text-muted">{q.source}</p>
                  ) : null}
                </Reveal>
              ))}
            </div>

            {pressKitButton}
          </div>
        ) : (
          pressKitButton
        )}
      </div>
    </section>
  );
}
