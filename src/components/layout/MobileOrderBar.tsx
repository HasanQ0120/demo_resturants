"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button, WhatsAppIcon } from "@/components/ui/Button";

const ORDER_FLOW_PATHS = ["/order/", "/cart", "/checkout", "/order-status"];
const isOrderFlowPath = (path: string) => ORDER_FLOW_PATHS.some((p) => path.startsWith(p));

/**
 * Sticky bottom order bar on phones.
 * On the home page it waits until the hero is scrolled past; on pages without a hero
 * (menu, policy) it appears after a short scroll instead.
 */
export function MobileOrderBar() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // the in-site order flow (customize/cart/checkout/status) has its own sticky continue bar —
  // showing the generic WhatsApp bar too would be a second, conflicting CTA mid-checkout
  const inOrderFlow = isOrderFlowPath(pathname);

  const update = useCallback((y: number) => {
    if (isOrderFlowPath(window.location.pathname)) return setVisible(false);
    const vh = window.innerHeight;
    const hero = document.getElementById("top");
    const threshold = hero ? hero.offsetHeight * 0.75 : 200;
    const nearBottom = y + vh > document.documentElement.scrollHeight - 320;
    // hide while the full-width order section is on screen (avoids a duplicate CTA)
    const order = document.getElementById("order")?.getBoundingClientRect();
    const orderInView = !!order && order.top < vh && order.bottom > 0;
    setVisible(y > threshold && !nearBottom && !orderInView);
  }, []);

  useMotionValueEvent(scrollY, "change", update);

  // re-evaluate on route change: a new page can start scrolled to the top with a different layout
  useEffect(() => {
    const id = requestAnimationFrame(() => update(window.scrollY));
    return () => cancelAnimationFrame(id);
  }, [pathname, update]);

  if (inOrderFlow) return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/85 px-4 pt-3 backdrop-blur-xl md:hidden"
        >
          <Button href={buildWhatsAppLink()} className="w-full">
            <WhatsAppIcon />
            {siteConfig.hero.primaryCta}
          </Button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
