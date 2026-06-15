import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Approach from "@/components/Approach";
import About from "@/components/About";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Portfolio />
        <Approach />
        <About />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
