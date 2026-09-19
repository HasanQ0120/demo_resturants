"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { PageCurtainProvider } from "./transitions/PageCurtain";

// NOTE: PageFade (the simple cross-fade) deliberately does NOT wrap {children} here — {children}
// is the WHOLE app shell (Navbar + main + Footer + MobileOrderBar, see layout.tsx), and fading
// that entire tree on every navigation was unmounting/remounting the navbar and footer each
// time. That's what caused the "lag and mismatch": Navbar re-mounting mid-transition loses its
// scroll-derived state (solid/transparent background) for a frame, so it visibly flickers/resets
// instead of staying put. PageFade is applied narrowly around just `<main>` in layout.tsx instead
// — only the actual page content fades; the navbar and footer never remount on navigation.
export function Providers({ children }: { children: ReactNode }) {
  // Runs after the browser's own initial fragment scroll (e.g. a reload of /#about) has
  // already happened, so that jump stays instant — see globals.css for the full reasoning.
  useEffect(() => {
    document.documentElement.classList.add("smooth-scroll");
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        <PageCurtainProvider>{children}</PageCurtainProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
