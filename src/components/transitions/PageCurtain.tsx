"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, m, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site";

/**
 * Hand-built replacement for Motion+'s (paid) PageCurtain component — same slanted clip-wipe
 * feel: a panel sweeps in covering the screen, the route swaps underneath while fully covered,
 * then the SAME sweep continues off the other side to reveal the new page. One continuous
 * motion rather than a fade, so route changes read as a deliberate wipe, not a flicker.
 *
 * `phase` is a ref, not React state: it's read/written only inside event handlers and effects
 * to drive the animation sequencing, never rendered directly (the visible label fade is derived
 * straight from the `x` motion value instead) — so nothing here calls setState inside an effect.
 */
type Phase = "idle" | "covering" | "uncovering";

const EASE = [0.22, 1, 0.36, 1] as const;
const SWEEP_S = 0.5;

const CurtainNavContext = createContext<(href: string) => void>(() => {});
/** Used by CurtainLink — triggers the wipe, then performs the real navigation once covered. */
export const useCurtainNav = () => useContext(CurtainNavContext);

/**
 * True from the moment a curtain-covered navigation actually swaps the route until the curtain
 * finishes uncovering it. Read (not subscribed to) by PageFade so a curtain-driven route change
 * doesn't ALSO run the separate fade underneath — it'd be invisible behind the opaque curtain
 * either way, but skipping it removes one axis of the two systems ever fighting each other.
 */
export let curtainNavActive = false;

/** Static routes outside the main nav that still deserve a friendly label on the curtain. */
const EXTRA_LABELS: Record<string, string> = {
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/order-status": "Order Status",
};

/** e.g. "/order/spicy-diavola" -> "Spicy Diavola" — reads the item id right off the URL. */
function labelForPath(path: string): string {
  const nav = siteConfig.nav.find((l) => l.href.split("#")[0] === path);
  if (nav) return nav.label;
  if (EXTRA_LABELS[path]) return EXTRA_LABELS[path];
  const lastSegment = path.split("/").filter(Boolean).pop();
  if (!lastSegment) return "";
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function PageCurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [label, setLabel] = useState("");
  const phase = useRef<Phase>("idle");
  const pendingHref = useRef<string | null>(null);
  const lastPathname = useRef(pathname);
  // percentage of the curtain's OWN (oversized) width — -100 fully off-screen left, 0 covering, 100 off-screen right
  const x = useMotionValue(-100);

  const navigate = useCallback(
    (href: string) => {
      const path = href.split("#")[0].split("?")[0] || "/";
      if (path === pathname) return; // already there — let the browser just jump to the hash/no-op
      if (reducedMotion) {
        router.push(href);
        return;
      }
      setLabel(labelForPath(path));
      pendingHref.current = href;
      phase.current = "covering";
      animate(x, 0, {
        duration: SWEEP_S,
        ease: EASE,
        onComplete: () => {
          curtainNavActive = true;
          if (pendingHref.current) router.push(pendingHref.current);
        },
      });
    },
    [pathname, reducedMotion, router, x],
  );

  // the new route has mounted underneath the (still fully-covering) curtain — sweep onward to reveal it
  useEffect(() => {
    if (pathname === lastPathname.current) return;
    lastPathname.current = pathname;
    if (phase.current !== "covering") return;
    phase.current = "uncovering";
    animate(x, 100, {
      duration: SWEEP_S,
      ease: EASE,
      onComplete: () => {
        x.set(-100); // instant — both -100 and 100 are off-screen, so this snap is invisible
        pendingHref.current = null;
        phase.current = "idle";
        curtainNavActive = false;
      },
    });
  }, [pathname, x]);

  return (
    <CurtainNavContext.Provider value={navigate}>
      {children}
      {!reducedMotion && <CurtainPanel x={x} label={label} />}
    </CurtainNavContext.Provider>
  );
}

function CurtainPanel({ x, label }: { x: ReturnType<typeof useMotionValue<number>>; label: string }) {
  // x is a plain number in % of this element's own (oversized) width — see the motion value
  // comment above — so it must be templated to a "N%" string for the transform to apply.
  const xPercent = useTransform(x, (v) => `${v}%`);
  // visible only while the curtain is at/near full cover (x ≈ 0) — fades out as it sweeps away
  // in either direction, all driven straight off the motion value, no separate phase state needed
  const labelOpacity = useTransform(x, [-25, 0, 25], [0, 1, 0]);

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-[-6%] z-[999] h-full w-[112%]"
      style={{ x: xPercent }}
    >
      <div
        className="relative size-full bg-background"
        style={{ clipPath: "polygon(0 0, 94% 0, 100% 100%, 0% 100%)" }}
      >
        <div className="flex h-full items-center justify-center pl-[6%] pr-[10%]">
          <m.span
            style={{ opacity: labelOpacity }}
            className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            {label}
          </m.span>
        </div>
        {/* leading edge accent, matching the brand accent used elsewhere (TracedFrame, cart badge) */}
        <div className="absolute inset-y-0 right-0 w-[3px] bg-primary" />
      </div>
    </m.div>
  );
}
