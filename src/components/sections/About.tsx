"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const { about } = siteConfig;
  return (
    <section id="about" className="relative overflow-hidden border-y border-foreground/10 bg-surface py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 size-[30rem] rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          <Reveal className="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-lg" delay={0.1}>
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>

        <div className="flex flex-col justify-end gap-10">
          <RevealGroup as="ul" className="grid grid-cols-3 gap-3 md:gap-6">
            {about.stats.map((s) => (
              <RevealItem as="li" key={s.label} className="rounded-2xl border border-foreground/10 p-4 md:p-6">
                <p className="font-display text-[clamp(1.75rem,7vw,3.25rem)] font-extrabold leading-none tracking-tight text-primary">
                  <Counter value={s.value} decimals={"decimals" in s ? s.decimals : 0} />
                  <span className="ml-0.5 text-[0.55em] text-foreground">{s.suffix}</span>
                </p>
                <p className="mt-2 text-xs text-muted md:text-sm">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-3">
            {about.features.map((f, i) => (
              <RevealItem
                as="li"
                key={f.title}
                className="rounded-2xl bg-background/60 p-5 ring-1 ring-foreground/10"
              >
                <span className="font-display text-sm font-bold text-accent">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = value.toFixed(decimals);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
    </span>
  );
}
