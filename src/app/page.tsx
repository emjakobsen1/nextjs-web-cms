import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import News from "@/components/News";
import Agenda from "@/components/Agenda";
import Biography from "@/components/Biography";
import Press from "@/components/Press";
import Footer from "@/components/Footer";
import { getHomeData } from "@/sanity/queries";

// The Sanity client fetches over plain HTTP, not the global `fetch()`, so
// Next can't see these requests to cache or revalidate them individually —
// without this, the route itself gets fully static-cached at build time and
// never picks up Studio edits again. This is what keeps it live.
export const revalidate = 60;

export default async function HomePage() {
  const { featuredRelease, projects, news, agenda, biography, press, contact } = await getHomeData();

  return (
    <>
      <Header />
      <main>
        <Hero release={featuredRelease} />
        <Agenda agenda={agenda} />
        <Projects projects={projects} />
        <News news={news} />
        <Biography biography={biography} />
        <Press press={press} />
      </main>
      <Footer contact={contact} />
    </>
  );
}
