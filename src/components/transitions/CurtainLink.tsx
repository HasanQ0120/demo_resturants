"use client";

import Link from "next/link";
import { forwardRef, type MouseEvent } from "react";
import { useCurtainNav } from "./PageCurtain";

type Props = React.ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link that plays the PageCurtain wipe before navigating.
 * Falls through to a plain Link click for anything that isn't a simple same-tab left-click to
 * an internal route — hash links (e.g. "/#about"), modified clicks (open in new tab, etc.), and
 * external/target="_blank" links all behave exactly as a normal Link.
 *
 * Forwards its ref (to the underlying <a>) so it can be wrapped with `m.create()`, the same way
 * ui/Button.tsx already wraps next/link — framer-motion needs that ref for hover/tap animations.
 */
export const CurtainLink = forwardRef<HTMLAnchorElement, Props>(function CurtainLink(
  { href, onClick, ...props },
  ref,
) {
  const navigate = useCurtainNav();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      hrefStr.includes("#") ||
      hrefStr.startsWith("http") ||
      props.target === "_blank" ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return; // let the browser/Link handle it natively
    }
    e.preventDefault();
    navigate(hrefStr);
  };

  return <Link ref={ref} href={href} onClick={handleClick} {...props} />;
});
