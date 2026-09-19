"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type MouseEvent } from "react";
import { useCurtainNav } from "./PageCurtain";

type Props = React.ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link that plays the PageCurtain wipe before navigating.
 * Falls through to a plain Link click for anything that isn't a simple same-tab left-click to
 * an internal route — modified clicks (open in new tab, etc.) and external/target="_blank" links
 * always behave exactly as a normal Link. A hash link (e.g. "/#about") is handled either way
 * depending on where you're clicking from: already on that page, it's a plain in-page scroll (no
 * curtain — nothing to cover); from a different page, it curtains like any other nav link, landing
 * on the target page with the browser's own scroll-to-anchor happening once it mounts.
 *
 * Forwards its ref (to the underlying <a>) so it can be wrapped with `m.create()`, the same way
 * ui/Button.tsx already wraps next/link — framer-motion needs that ref for hover/tap animations.
 */
export const CurtainLink = forwardRef<HTMLAnchorElement, Props>(function CurtainLink(
  { href, onClick, ...props },
  ref,
) {
  const navigate = useCurtainNav();
  const pathname = usePathname();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";
  const targetPath = hrefStr.split("#")[0].split("?")[0] || "/";
  const isInPageAnchor = hrefStr.includes("#") && targetPath === pathname;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      isInPageAnchor ||
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
