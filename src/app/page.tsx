import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import News from "@/components/News";
import Agenda from "@/components/Agenda";
import Biography from "@/components/Biography";
import Press from "@/components/Press";
import Footer from "@/components/Footer";
import { getHomeData } from "@/sanity/queries";

export default async function HomePage() {
  const { hero, projects, news, agenda, biography, press, contact } = await getHomeData();

  return (
    <>
      <Header />
      <main>
        <Hero hero={hero} />
        <Projects projects={projects} />
        <News news={news} />
        <Agenda agenda={agenda} />
        <Biography biography={biography} />
        <Press press={press} />
      </main>
      <Footer contact={contact} />
    </>
  );
}
