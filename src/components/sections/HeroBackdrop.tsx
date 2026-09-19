"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Atmospheric backdrop behind the 3D hero.
 *
 * Drop a wide, dark, low-detail image at /public/hero-bg.jpg (e.g. 2000x1200, warm and out of focus).
 * If the file is missing or fails to load, the gradient layers below stay on their own — the hero
 * still looks finished, so the image is a bonus rather than a dependency.
 *
 * Layering: this sits at z-0 inside the hero's isolated stacking context, behind the copy and the
 * 3D canvas (z-10), and is pointer-events-none so dragging the burger is never intercepted.
 */
export function HeroBackdrop({ src = "/hero-bg.jpg" }: { src?: string }) {
  const [hasImage, setHasImage] = useState(true);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* fallback / base: solid brand background */}
      <div className="absolute inset-0 bg-background" />

      {hasImage && (
        <Image
          src={src}
          alt=""
          fill
          priority={false}
          quality={75}
          sizes="100vw"
          onError={() => setHasImage(false)}
          className="object-cover opacity-40 [mask-image:radial-gradient(75%_75%_at_60%_40%,#000_35%,transparent_100%)]"
        />
      )}

      {/* warm ambient glow, always present */}
      <div className="absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] lg:left-3/4" />
      {/* fade the backdrop into the page so the section edges stay seamless */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/25 to-background" />
    </div>
  );
}
