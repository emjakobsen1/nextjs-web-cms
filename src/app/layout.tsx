import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from "@/lib/theme";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Jesper Lørup — Drummer & Composer",
    template: "%s — Jesper Lørup",
  },
  description:
    "Jesper Lørup is a Danish jazz drummer and composer. Releases, projects, upcoming shows and contact.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      // The inline script below sets data-theme on this element directly,
      // before React hydrates, to avoid a flash of the wrong palette for
      // returning visitors — React doesn't know about that attribute, so
      // without this it logs a (harmless) hydration mismatch warning.
      suppressHydrationWarning
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {/* Applies a previously-chosen theme before first paint, so
            returning visitors never see a flash of the default palette.
            Built from THEMES rather than a hardcoded id, so renaming or
            adding a preset in lib/theme.ts doesn't require touching this
            script too. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(
              THEMES.filter((t) => t.id !== DEFAULT_THEME).map((t) => t.id),
            )}.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
