import Hero from "@/components/home/Hero";
import LiveRates from "@/components/home/LiveRates";
import DailyOffers from "@/components/home/DailyOffers";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import CustomJewelleryCTA from "@/components/home/CustomJewelleryCTA";
import WeddingCollection from "@/components/home/WeddingCollection";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import StoreLocation from "@/components/home/StoreLocation";

// Each section fetches its own data server-side (Supabase) and is designed
// to render nothing (return null) gracefully if that table is empty —
// see e.g. DailyOffers, WeddingCollection. That's why the page composes
// cleanly even before you've added real catalogue data.
export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveRates />
      <DailyOffers />
      <CategoryGrid />
      <FeaturedProducts />
      <NewArrivals />
      <WhyChooseUs />
      <Services />
      <CustomJewelleryCTA />
      <WeddingCollection />
      <AboutSection />
      <Testimonials />
      <StoreLocation />
    </>
  );
}
