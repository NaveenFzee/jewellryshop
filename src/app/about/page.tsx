import type { Metadata } from "next";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import StoreLocation from "@/components/home/StoreLocation";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      <AboutSection />
      <Testimonials />
      <StoreLocation />
    </div>
  );
}
