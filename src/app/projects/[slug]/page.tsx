import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContact, getProjectBySlug } from "@/sanity/queries";
import ProjectDetail from "@/components/ProjectDetail";
import Header from "@/components/Header";
import CloseLink from "@/components/CloseLink";
import Footer from "@/components/Footer";
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
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const [project, contact] = await Promise.all([getProjectBySlug(slug), getContact()]);
  if (!project) notFound();

  const backHref = toSafeInternalPath(from, "/");

  return (
    <main className="relative min-h-dvh bg-bg">
      <Header />
      <CloseLink href={backHref} />
      <ProjectDetail project={project} />
      <Footer contact={contact} />
    </main>
  );
}
