"use client";

import Image from "next/image";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const MAX_TILT = 8; // degrees — subtle, not gimmicky

/**
 * Horizontal slices of the photo, top of image (bun top) to bottom (bun/plate), used to fake a
 * "the burger assembles itself" entrance: each slice is a clipped copy of the SAME photo, so it
 * stays pixel-perfect, but they drop in bottom-to-top so it reads as bottom bun → patty →
 * toppings → top bun landing last, like a real build — no separate ingredient images needed.
 */
const BAND_COUNT = 6;
const bands = Array.from({ length: BAND_COUNT }, (_, i) => ({
  clipPath: `inset(${(i * 100) / BAND_COUNT}% 0 ${100 - ((i + 1) * 100) / BAND_COUNT}% 0)`,
  // top-most band (i = 0) travels furthest and lands last, like a lid closing on the stack
  dropDistance: 90 - i * 14,
  delay: 0.15 + (BAND_COUNT - 1 - i) * 0.09,
}));

/**
 * The hero's product photo. Always the visual (no swap to a 3D model, no loading state) —
 * see the conversation that led here: a stylized procedural burger next to a real photo
 * reads as "the cheap one," so the photo is now the permanent hero on every device.
 *
 * Desktop gets a light pointer-follow tilt (mouse only — touch devices stay fully static,
 * matching mobile) so the hero still feels alive without pretending to be true 3D.
 */
export function HeroPhoto({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // 0..1 across the element; settle back to centre (0.5, 0.5) = no tilt.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        // mouse/trackpad only — touch devices get no tilt (dragging would fight page scroll)
        if (reducedMotion || e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={reset}
      className="absolute inset-0 [perspective:1200px]"
    >
      <m.div
        style={reducedMotion ? undefined : { rotateX, rotateY }}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative size-full"
      >
        <div aria-hidden className="animate-glow absolute inset-0 m-auto size-3/5 rounded-full bg-primary/15 blur-3xl" />

        {reducedMotion ? (
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, min(100vw, 34rem)"
            className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)]"
          />
        ) : (
          // the shadow filter lives on THIS outer, unclipped layer so it reads as one soft
          // shadow under the whole composited photo, not six separate shadows with seams
          // between bands — the inner layer clips each band so it slides in cleanly.
          <div className="absolute inset-0 drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 overflow-hidden">
              {/* one photo, sliced into horizontal bands that drop in bottom-to-top on mount —
                  see the `bands` comment above for why this fakes assembly with no ingredient art */}
              {bands.map((band, i) => (
                <m.div
                  key={i}
                  initial={{ y: -band.dropDistance, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: band.delay, type: "spring", stiffness: 300, damping: 20 }}
                  style={{ clipPath: band.clipPath }}
                  className="absolute inset-0"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={i === BAND_COUNT - 1}
                    sizes="(min-width: 1024px) 50vw, min(100vw, 34rem)"
                    className="object-contain"
                  />
                </m.div>
              ))}
            </div>
          </div>
        )}
      </m.div>
    </div>
  );
}
