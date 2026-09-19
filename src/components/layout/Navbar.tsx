"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { CartIcon } from "./CartIcon";
import { CurtainLink } from "@/components/transitions/CurtainLink";

/** Section links like "/#about" only mark the route, never the active page. */
const isCurrent = (href: string, pathname: string) => !href.includes("#") && href === pathname;

export function Navbar() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-foreground/10 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <CurtainLink href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.brand.name} home`}>
          <Image src={siteConfig.brand.logo} alt="" width={36} height={36} priority className="size-9" />
          <span className="font-display text-lg font-bold tracking-tight">{siteConfig.brand.name}</span>
        </CurtainLink>

        <div className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((link) => {
            const current = isCurrent(link.href, pathname);
            return (
              <CurtainLink
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                  current ? "text-foreground" : "text-foreground/70"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-primary transition-transform duration-300 group-hover:scale-x-100 ${
                    current ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </CurtainLink>
            );
          })}
          <CartIcon />
          {/* not tied to one item, so this sends people to choose something, not straight to WhatsApp */}
          <Button href="/menu" className="min-h-11 px-5 text-sm">
            {siteConfig.hero.primaryCta}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartIcon />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2 grid size-12 place-items-center"
          >
            <span
              className={`absolute h-0.5 w-6 rounded bg-foreground transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-0.5 w-6 rounded bg-foreground transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex h-[calc(100dvh-4rem)] flex-col justify-between bg-background px-5 pb-10 pt-6 md:hidden"
          >
            <ul className="space-y-1">
              {siteConfig.nav.map((link, i) => {
                const current = isCurrent(link.href, pathname);
                return (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <CurtainLink
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center gap-3 py-3 font-display text-4xl font-bold tracking-tight ${
                        current ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {link.label}
                    </CurtainLink>
                  </m.li>
                );
              })}
            </ul>
            <Button href="/menu" className="w-full" onClick={() => setOpen(false)}>
              {siteConfig.hero.primaryCta}
            </Button>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
