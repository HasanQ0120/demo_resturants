import { Hero } from "@/components/sections/Hero";
import { FeaturedMenu } from "@/components/sections/FeaturedMenu";
import { About } from "@/components/sections/About";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { OrderCTA } from "@/components/sections/OrderCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <About />
      <LocationsSection />
      <OrderCTA />
    </>
  );
}
