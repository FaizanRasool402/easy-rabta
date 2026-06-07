import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyTypeSection from "@/components/PropertyTypeSection";
import StateCards from "@/components/StateCards";
import Cities from "@/components/Cities";
import Features from "@/components/Features";
import Feeatures from "@/components/Feeatures";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const VideoP = dynamic(() => import("@/components/VideoP"));
const PropertyVideos = dynamic(() => import("@/components/PropertyVideos"));
const LatestListings = dynamic(() => import("@/components/LatestListings"));
const Lifestyle = dynamic(() => import("@/components/Lifestyle"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const HomeFAQs = dynamic(() => import("@/components/HomeFAQs"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PropertyTypeSection />
        <StateCards />
        <VideoP />
        <PropertyVideos />
        <LatestListings />
        <Cities />
        <Lifestyle />
        <Features />
        <Feeatures />
        <Testimonials />
        <HomeFAQs />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
