"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

type TracedFrameProps = {
  children: ReactNode;
  className?: string;
  /** seconds for one full loop around the frame */
  duration?: number;
  /** corner radius in px — keep in sync with the wrapper's own rounded-[Npx] class below */
  radius?: number;
};

/**
 * A soft segment of light that continuously traces the rounded border of its children, like
 * a spotlight sweeping a loop around a group of cards — matches an animated SVG path/dash
 * technique rather than a CSS gradient trick, so corners render correctly at any size.
 *
 * Measures its own box (ResizeObserver) and draws a <rect pathLength={100}> around it, so the
 * "16% of the loop is lit" dash values stay simple percentages regardless of actual pixels.
 * No WebGL/three.js — cheap enough to run everywhere, including phones. Falls back to a
 * static (frozen) segment under `prefers-reduced-motion`.
 */
export function TracedFrame({ children, className = "", duration = 7, radius = 32 }: TracedFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // getBoundingClientRect (not ResizeObserver's own contentRect) so padding is included —
    // the traced line should run around the full visible box, with breathing room inside it.
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { width, height } = size;
  const inset = 2.5; // keeps the stroke fully inside the viewBox rather than clipped at the edge

  return (
    <div
      ref={ref}
      className={`relative rounded-[2rem] ${className}`}
      style={{ "--traced-duration": `${duration}s` } as CSSProperties}
    >
      {width > 0 && height > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* soft glow halo, blurred and wider */}
          <rect
            className="traced-path"
            x={inset}
            y={inset}
            width={width - inset * 2}
            height={height - inset * 2}
            rx={radius}
            ry={radius}
            fill="none"
            stroke={siteConfig.theme.accent}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="16 84"
            opacity={0.6}
            style={{ filter: "blur(9px)" }}
          />
          {/* crisp core line on top */}
          <rect
            className="traced-path"
            x={inset}
            y={inset}
            width={width - inset * 2}
            height={height - inset * 2}
            rx={radius}
            ry={radius}
            fill="none"
            stroke={siteConfig.theme.accent}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="16 84"
          />
        </svg>
      )}
      {children}
    </div>
  );
}
