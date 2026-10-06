import type { Metadata } from "next";
import { getAllReleases } from "@/sanity/queries";
import ReleasesIndex from "@/components/ReleasesIndex";
import Header from "@/components/Header";

// See src/app/page.tsx for why this is needed: the Sanity client bypasses
// Next's fetch cache entirely, so without an explicit revalidate window this
// route would be cached at build time and never reflect Studio edits.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Releases",
};

export default async function ReleasesPage() {
  const releases = await getAllReleases();

  return (
    <main className="relative min-h-dvh bg-bg">
      <Header />
      <ReleasesIndex releases={releases} />
    </main>
  );
}
