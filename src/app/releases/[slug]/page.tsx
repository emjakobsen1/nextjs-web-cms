import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllReleases, getReleaseBySlug } from "@/sanity/queries";
import ReleaseDetail from "@/components/ReleaseDetail";
import Header from "@/components/Header";
import { toSafeInternalPath } from "@/lib/safePath";

// See src/app/page.tsx for why this is needed: the Sanity client bypasses
// Next's fetch cache entirely, so without an explicit revalidate window this
// route would be cached at build time and never reflect Studio edits.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return {};
  return { title: release.title, description: release.description };
}

export default async function ReleasePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const [release, releases] = await Promise.all([getReleaseBySlug(slug), getAllReleases()]);
  if (!release) notFound();

  // Carried through "next release" navigation unchanged (see
  // NextReleaseFooter), so however many releases get browsed in a row, the
  // close button always lands back at the page this chain started from.
  const backHref = toSafeInternalPath(from, "/");

  return (
    <main className="relative min-h-dvh bg-bg">
      <Header />
      <Link
        href={backHref}
        aria-label="Close"
        className="fixed top-28 right-6 z-10 text-6xl leading-none font-normal text-fg transition-opacity hover:opacity-70"
      >
        &times;
      </Link>
      <ReleaseDetail release={release} releases={releases} originHref={backHref} />
    </main>
  );
}
