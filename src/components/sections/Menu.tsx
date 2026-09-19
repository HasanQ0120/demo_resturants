"use client";

import { AnimatePresence, animate, m, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { categories, menuItems } from "@/data/menu";
import { SectionHeading } from "./SectionHeading";
import { MenuCard } from "./MenuCard";

const PILL_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export function Menu() {
  const [active, setActive] = useState("all");
  const items = active === "all" ? menuItems : menuItems.filter((i) => i.category === active);
  const { menuSection } = siteConfig;

  // one shared pill, moved/resized under whichever tab is active — a "smooth tabs" style
  // sliding indicator built from motion values directly (not framer's `layoutId`, which needs
  // the heavier domMax feature bundle; this project deliberately keeps the smaller domAnimation
  // bundle, see providers.tsx/README, so the slide is driven by hand instead).
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const pillReady = useRef(false);
  const pillX = useMotionValue(0);
  const pillWidth = useMotionValue(0);

  useEffect(() => {
    const btn = tabRefs.current.get(active);
    if (!btn) return;
    if (!pillReady.current) {
      // first paint: snap into place under the initial tab, no slide-in from nowhere
      pillX.set(btn.offsetLeft);
      pillWidth.set(btn.offsetWidth);
      pillReady.current = true;
      return;
    }
    animate(pillX, btn.offsetLeft, PILL_SPRING);
    animate(pillWidth, btn.offsetWidth, PILL_SPRING);
  }, [active, pillX, pillWidth]);

  return (
    <section id="menu" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading {...menuSection} />

          <div
            role="tablist"
            aria-label="Menu categories"
            className="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
          >
            <m.span
              aria-hidden
              className="absolute left-0 top-0 h-11 rounded-full bg-primary"
              style={{ x: pillX, width: pillWidth }}
            />
            {categories.map((c) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    if (el) tabRefs.current.set(c.id, el);
                  }}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActive(c.id)}
                  className={`relative min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors ${
                    selected ? "text-background" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {!selected && <span className="absolute inset-0 rounded-full border border-foreground/15" />}
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
