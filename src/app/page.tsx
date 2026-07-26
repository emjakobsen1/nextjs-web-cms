import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Releases from "@/components/Releases";
import Concerts from "@/components/Concerts";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Releases />
        <Concerts />
        <About />
      </main>
      <Footer />
    </>
  );
}
