import type { Contact } from "@/sanity/queries";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";

export default function Footer({ contact }: { contact: Contact | null }) {
  if (!contact) return null;

  return (
    <footer id="contact" className="bg-fg px-4 py-8 text-bg md:px-5 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-sm uppercase tracking-[0.2em] text-bg/60">
          Contact
        </Reveal>

        <Reveal
          delay={80}
          className="mt-4 flex flex-wrap items-center justify-between gap-6"
        >
          <a
            href={`mailto:${contact.email}`}
            className="text-2xl uppercase tracking-tight underline decoration-bg/30 decoration-2 underline-offset-4 hover:decoration-bg md:text-3xl"
          >
            {contact.email}
          </a>

          {contact.socialLinks?.length ? (
            <ul className="flex flex-wrap gap-2">
              {contact.socialLinks.map(({ platform, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={platform}
                    className="flex h-12 w-12 items-center justify-center border border-bg/20 transition-colors hover:bg-bg hover:text-fg"
                  >
                    <SocialIcon platform={platform} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        <p className="mt-10 text-center text-sm text-bg/60">
          {`© ${new Date().getFullYear()} Jesper Lørup. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
