import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StateCards from "@/components/StateCards";
import VideoP from "@/components/VideoP";
import PropertyVideos from "@/components/PropertyVideos";
import Cities from "@/components/Cities";
import Lifestyle from "@/components/Lifestyle";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Feeatures from "@/components/Feeatures";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StateCards />
        <VideoP />
        <PropertyVideos />
        <Cities />
        <Lifestyle />
        <Features />
        <Feeatures />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
