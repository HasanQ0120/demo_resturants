import type { Metadata } from "next";
import { Menu } from "@/components/sections/Menu";
import { OrderCTA } from "@/components/sections/OrderCTA";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Menu",
  description: siteConfig.menuSection.subtitle,
};

export default function MenuPage() {
  return (
    <>
      {/* top padding clears the fixed navbar */}
      <div className="pt-16 md:pt-20">
        <Menu />
      </div>
      <OrderCTA />
    </>
  );
}
