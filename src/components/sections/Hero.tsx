import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { withVersion } from "@/lib/asset-version";
import { Button, WhatsAppIcon } from "@/components/ui/Button";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroPhoto } from "./HeroPhoto";

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

export function Hero() {
  const { hero } = siteConfig;
  // Cache-busted: swapping these files (same filename) shows up immediately — see asset-version.ts.
  const posterSrc = withVersion("/hero-poster.webp");
  const backdropSrc = withVersion("/hero-bg.jpg");

  return (
    // `isolate` keeps the backdrop layer behind this section only, never behind the page background
    <section id="top" className="relative isolate overflow-hidden pt-20 md:pt-24">
      <HeroBackdrop src={backdropSrc} />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-4 px-5 md:px-8 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="pt-6 lg:pt-0">
          <p
            className="animate-rise mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-3.5 py-1.5 text-xs font-medium text-foreground/80"
            style={delay(0)}
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {hero.eyebrow}
          </p>

          <h1 className="font-display text-[clamp(2.9rem,12vw,6.25rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            {hero.titleLines.map((line, i) => (
              <span key={line} className="animate-rise block" style={delay(0.08 + i * 0.08)}>
                {i === hero.titleLines.length - 1 ? <span className="text-primary">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p
            className="animate-rise text-balance mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg"
            style={delay(0.35)}
          >
            {hero.subtitle}
          </p>

          <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row" style={delay(0.45)}>
            <Button href={buildWhatsAppLink()}>
              <WhatsAppIcon />
              {hero.primaryCta}
            </Button>
            <Button href="/menu" variant="ghost">
              {hero.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          {/* the hero visual: a photo on every device, with a light pointer-tilt on desktop */}
          <HeroPhoto src={posterSrc} />
        </div>
      </div>
    </section>
  );
}
