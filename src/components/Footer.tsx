import Image from "next/image";

const SOCIALS = ["Bandcamp", "Soundcloud", "Spotify", "Instagram"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-lavender px-4 py-6 text-black md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block border border-black/15 bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-black">
          Send me a message
        </span>
        <Image
          src="/images/contact-removebg-preview.png"
          alt="Contact"
          width={215}
          height={83}
          className="ink-fat mt-4 h-[2.24rem] w-auto md:h-[3.92rem]"
        />
        <a
          href="mailto:booking@jesperlorup.com"
          className="mt-4 inline-block text-lg text-black underline decoration-black/30 decoration-2 underline-offset-4 hover:decoration-black"
        >
          booking@jesperlorup.com
        </a>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-black/15 pt-8">
          <ul className="flex flex-wrap gap-1">
            {SOCIALS.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className="inline-block px-3 py-2 text-sm uppercase tracking-[0.1em] text-black transition-colors hover:bg-black hover:text-white"
                >
                  {social}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-black/60">
            &copy; 2026 Jesper L&oslash;rup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
