"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Simple cross-fade for every route change that ISN'T through the navbar (see PageCurtain.tsx
 * for that one). Old content fades out, new content fades in — no wipe, no label, just a quick
 * opacity transition. Runs underneath the curtain too when that IS used: the curtain is a fully
 * opaque overlay above this, so the fade still happens, it's just invisible while covered.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
