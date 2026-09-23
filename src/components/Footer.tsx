import type { Contact } from "@/sanity/queries";
import Reveal from "./Reveal";

export default function Footer({ contact }: { contact: Contact | null }) {
  if (!contact) return null;

  return (
    <footer id="contact" className="bg-fg px-4 py-16 text-bg md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-bg/60">
          Contact
        </Reveal>
        <Reveal delay={80}>
          <a
            href={`mailto:${contact.email}`}
            className="mt-4 inline-block text-3xl uppercase tracking-tight underline decoration-bg/30 decoration-2 underline-offset-4 hover:decoration-bg md:text-4xl"
          >
            {contact.email}
          </a>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-bg/15 pt-8">
          {contact.socialLinks?.length ? (
            <ul className="flex flex-wrap gap-1">
              {contact.socialLinks.map(({ platform, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-2 text-sm uppercase tracking-[0.1em] transition-colors hover:bg-bg hover:text-fg"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <p className="text-sm text-bg/60">
            {`© ${new Date().getFullYear()} Jesper Lørup. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
