export type QualityTier = "low" | "high";

/** Phones, touch devices and low-core/low-memory machines get the lightweight scene. */
export function detectTier(): QualityTier {
  if (typeof window === "undefined") return "low";
  const mq = (q: string) => window.matchMedia(q).matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const low =
    mq("(max-width: 768px)") ||
    mq("(pointer: coarse)") ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4;
  return low ? "low" : "high";
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
