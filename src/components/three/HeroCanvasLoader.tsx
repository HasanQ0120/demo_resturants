"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { HeroFallback } from "./HeroFallback";
import { detectTier, hasWebGL } from "./quality";

// three / fiber / drei live in this separate chunk and never block first paint.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Status =
  /** deciding (server render + first client frame) */
  | "idle"
  /** phone, touch device or no WebGL: the photo is the hero, 3D is never downloaded */
  | "photo"
  /** desktop: 3D chunk requested, photo still showing */
  | "loading"
  /** desktop: 3D rendered */
  | "ready";

export function HeroCanvasLoader({ posterSrc }: { posterSrc?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let inView = false;
    let scheduled = false;
    let cancelIdle = () => {};
    let io: IntersectionObserver | undefined;
    const sync = () => setActive(inView && document.visibilityState === "visible");

    const startLoad = () => {
      if (scheduled) return;
      scheduled = true;
      const run = () => setStatus("loading");
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(run, { timeout: 1200 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(run, 300);
        cancelIdle = () => clearTimeout(id);
      }
    };

    // decided off the render pass: capability checks touch the DOM and set state
    const frame = requestAnimationFrame(() => {
      // Phones and touch devices keep the static photo: no canvas, no three.js download.
      if (detectTier() === "low" || !hasWebGL()) {
        setStatus("photo");
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) startLoad();
          sync();
        },
        { rootMargin: "150px" },
      );
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
    });

    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelIdle();
    };
  }, []);

  const mounted = status === "loading" || status === "ready";

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className={`transition-opacity duration-700 ${status === "ready" ? "opacity-0" : "opacity-100"}`}
        aria-hidden={status === "ready"}
      >
        <HeroFallback src={posterSrc} loading={status === "idle" || status === "loading"} />
      </div>

      {mounted && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        >
          <HeroScene active={active} onReady={() => setStatus("ready")} />
        </div>
      )}

      {/* only meaningful when the interactive scene is actually on screen */}
      <p
        className={`pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-muted/80 transition-opacity duration-500 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      >
        {siteConfig.hero.dragHint}
      </p>
    </div>
  );
}
