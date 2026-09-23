/**
 * Per-letter hover roll: each character is doubled and stacked, the top
 * copy slides out while its twin slides in from below, staggered
 * left-to-right. Needs a `group` class on the hoverable ancestor.
 */
export default function RollText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const letters = Array.from(text);

  return (
    <span className={`inline-flex ${className}`}>
      {letters.map((ch, i) => (
        <span
          key={i}
          className="relative inline-block h-[1em] overflow-hidden align-top leading-none"
        >
          <span
            className="block transition-transform duration-200 ease-in-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 block translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
