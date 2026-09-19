"use client";

import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, ...(delay ? { delay } : {}) },
  }),
};

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "ul";
};

/** Fades + lifts its content once when scrolled into view. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      custom={delay}
    >
      {children}
    </Tag>
  );
}

/** Staggers any <RevealItem> children. */
export function RevealGroup({ children, className, as = "div" }: RevealProps) {
  const Tag = m[as];
  return (
    <Tag
      className={className}
      variants={group}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = "div" }: RevealProps) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
