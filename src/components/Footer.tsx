import type { Contact } from "@/sanity/queries";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";

export default function Footer({ contact }: { contact: Contact | null }) {
  if (!contact) return null;

  return (
    <footer id="contact" className="bg-black px-6 py-8 text-accent md:px-12 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        <Reveal className="flex flex-wrap items-center justify-between gap-6">
          <a
            href={`mailto:${contact.email}`}
            className="text-2xl uppercase tracking-tight underline decoration-accent/30 decoration-2 underline-offset-4 hover:decoration-accent md:text-3xl"
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
                    className="flex h-14 w-14 items-center justify-center border border-accent/20 transition-colors hover:bg-accent hover:text-black"
                  >
                    <SocialIcon platform={platform} className="h-6 w-6" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        <p className="mt-10 text-center text-sm text-accent/60">
          {`© ${new Date().getFullYear()} Jesper Lørup. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
