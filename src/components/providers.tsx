"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { PageCurtainProvider } from "./transitions/PageCurtain";
import { PageFade } from "./transitions/PageFade";

export function Providers({ children }: { children: ReactNode }) {
  // Runs after the browser's own initial fragment scroll (e.g. a reload of /#about) has
  // already happened, so that jump stays instant — see globals.css for the full reasoning.
  useEffect(() => {
    document.documentElement.classList.add("smooth-scroll");
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        <PageCurtainProvider>
          <PageFade>{children}</PageFade>
        </PageCurtainProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
