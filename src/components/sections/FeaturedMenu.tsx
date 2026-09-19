import { siteConfig } from "@/config/site";
import { menuItems } from "@/data/menu";
import { SectionHeading } from "./SectionHeading";
import { MenuCard } from "./MenuCard";
import { Reveal } from "@/components/motion/Reveal";
import { TracedFrame } from "./TracedFrame";
import { CurtainLink } from "@/components/transitions/CurtainLink";

/** Home-page teaser: the items flagged `featured` in the menu data, capped at three. */
export function FeaturedMenu() {
  const { featuredSection } = siteConfig;
  const featured = menuItems.filter((i) => i.featured).slice(0, 3);
  const items = featured.length ? featured : menuItems.slice(0, 3);

  return (
    <section id="featured" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* a traced line of light frames the heading + card row, like a spotlight sweeping the loop */}
        <TracedFrame className="p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading {...featuredSection} />
            <Reveal className="hidden md:block" delay={0.1}>
              <CurtainLink
                href="/menu"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary hover:text-background"
              >
                {featuredSection.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </CurtainLink>
            </Reveal>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-6">
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </ul>
        </TracedFrame>

        <Reveal className="mt-8 md:hidden">
          <CurtainLink
            href="/menu"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 px-6 text-base font-semibold"
          >
            {featuredSection.cta}
            <span aria-hidden>→</span>
          </CurtainLink>
        </Reveal>
      </div>
    </section>
  );
}
