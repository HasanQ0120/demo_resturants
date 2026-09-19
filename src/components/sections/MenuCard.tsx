"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import type { Ref } from "react";
import type { MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";

// internal routes navigate client-side (and prefetch) — same pattern as ui/Button.tsx
const MotionLink = m.create(Link);

// `ref` must reach the root element for AnimatePresence mode="popLayout"
type Props = { item: MenuItem; index: number; ref?: Ref<HTMLLIElement> };

export function MenuCard({ item, index, ref }: Props) {
  return (
    <m.li
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay: Math.min(index, 5) * 0.06 }}
      whileHover="hover"
      className="group relative flex overflow-hidden rounded-3xl border border-foreground/10 bg-surface transition-colors duration-300 hover:border-primary/40 sm:flex-col"
    >
      {/* Phones: compact row (square photo thumb left). sm+: tall card with a full-bleed 4:3 photo. */}
      <div className="relative m-3 aspect-square w-28 shrink-0 self-center overflow-hidden rounded-2xl bg-background sm:m-0 sm:aspect-[4/3] sm:w-full sm:rounded-none">
        <m.div
          className="absolute inset-0"
          variants={{ hover: { scale: 1.05 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 112px"
            className="object-cover"
          />
        </m.div>
        {/* soft fade into the card body on larger cards */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-surface to-transparent sm:block" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-4 pr-4 sm:gap-2 sm:p-5 md:p-6">
        {item.badge && (
          <span className="self-start rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-background sm:absolute sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
            {item.badge}
          </span>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight sm:text-xl md:text-2xl">
            {item.name}
          </h3>
          <span className="shrink-0 font-display font-bold tabular-nums text-accent sm:text-lg">
            {item.sizes?.length ? `From ${formatPrice(item.price)}` : formatPrice(item.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted sm:line-clamp-none">{item.description}</p>

        <div className="mt-auto pt-2 sm:pt-4">
          {/* item-specific order button → the in-site customize/order flow (see src/app/order) */}
          <MotionLink
            href={`/order/${item.id}`}
            whileTap={{ scale: 0.96 }}
            aria-label={`Order ${item.name}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary hover:text-background"
          >
            Order
            <m.span aria-hidden variants={{ hover: { x: 3 } }}>
              →
            </m.span>
          </MotionLink>
        </div>
      </div>
    </m.li>
  );
}
