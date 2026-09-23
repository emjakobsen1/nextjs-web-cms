import type { Contact } from "@/sanity/queries";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";

export default function Footer({ contact }: { contact: Contact | null }) {
  if (!contact) return null;

  return (
    <footer id="contact" className="bg-fg px-6 py-8 text-bg md:px-12 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
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
                    className="flex h-14 w-14 items-center justify-center border border-bg/20 transition-colors hover:bg-bg hover:text-fg"
                  >
                    <SocialIcon platform={platform} className="h-6 w-6" />
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
