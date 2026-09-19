import type { Metadata } from "next";
import { legalConfig, legalSections } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

export const metadata: Metadata = {
  title: "Policies & Terms",
  description: legalConfig.subtitle,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(siteConfig.locale, { year: "numeric", month: "long", day: "numeric" });

export default function PolicyPage() {
  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={legalConfig.eyebrow}
          title={legalConfig.title}
          subtitle={legalConfig.subtitle}
        />
        <Reveal delay={0.1}>
          <p className="mt-5 text-sm text-muted">Last updated: {formatDate(legalConfig.lastUpdated)}</p>
        </Reveal>

        {/* jump links */}
        <Reveal delay={0.15}>
          <ul className="mt-8 flex flex-wrap gap-2">
            {legalSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-foreground/15 px-5 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary hover:text-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* same left edge as the header above, but a comfortable reading measure */}
      <div className="mx-auto mt-14 max-w-7xl px-5 pb-24 md:mt-20 md:px-8 md:pb-32">
        <div className="max-w-3xl">
          {legalSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-t border-foreground/10 py-12 first:border-t-0 first:pt-0 md:py-16"
            >
              <Reveal>
                <h2 className="font-display text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold leading-tight tracking-[-0.02em]">
                  {section.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{section.summary}</p>
              </Reveal>

              <div className="mt-8 space-y-8">
                {section.blocks.map((block, i) => (
                  <Reveal key={block.heading} delay={Math.min(i, 4) * 0.04}>
                    <h3 className="font-display text-lg font-bold md:text-xl">{block.heading}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">{block.body}</p>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}

          <Reveal>
            <p className="border-t border-foreground/10 pt-10 text-sm text-muted">{legalConfig.contactNote}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
