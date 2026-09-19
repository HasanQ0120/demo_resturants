import { siteConfig } from "@/config/site";
import { locations } from "@/data/locations";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { LocationsMapLoader } from "./LocationsMapLoader";

export function LocationsSection() {
  return (
    <section id="locations" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading {...siteConfig.locationsSection} />

        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {locations.map((loc) => (
                <li key={loc.id} className="rounded-2xl border border-foreground/10 bg-surface p-4">
                  <p className="font-display font-bold">{loc.name}</p>
                  <p className="mt-1 text-sm text-muted">{loc.address}</p>
                </li>
              ))}
            </ul>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-foreground/10 sm:aspect-video lg:aspect-auto">
              <LocationsMapLoader />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
