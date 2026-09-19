"use client";

import { m } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { CurtainLink } from "@/components/transitions/CurtainLink";

// internal routes navigate client-side (and prefetch); everything else is a plain anchor.
// The PageCurtain wipe is reserved for the navbar (see `curtain` prop below) — everywhere
// else gets the simple site-wide fade instead (PageFade.tsx), so it isn't on every click.
const MotionLink = m.create(Link);
const MotionCurtainLink = m.create(CurtainLink);

type Variant = "primary" | "ghost" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-background shadow-[0_10px_40px_-10px_var(--brand-primary)] hover:brightness-110",
  ghost: "border border-foreground/20 text-foreground hover:border-foreground/50 hover:bg-foreground/5",
  dark: "bg-background text-foreground hover:bg-background/90",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  /** Plays the PageCurtain wipe instead of the default fade — the navbar's Order Now uses this. */
  curtain?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
  onClick,
  curtain = false,
}: ButtonProps) {
  const external = href.startsWith("http");
  const internalRoute = href.startsWith("/") && !href.startsWith("//");
  const Tag = internalRoute ? (curtain ? MotionCurtainLink : MotionLink) : m.a;

  return (
    <Tag
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-[filter,background-color,border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variants[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.4 9.4 0 0 1 9.43 9.44c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.3 11.3 0 0 0 12.05.72C5.8.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.64l6.04-1.58a11.3 11.3 0 0 0 5.4 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}
