"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { getAddOn } from "@/data/addons";
import { getMenuItem } from "@/data/menu";
import { orderFlowConfig } from "@/config/orderFlow";
import { formatPrice } from "@/lib/format";
import { cartBreakdown, lineSubtotal, removeCartLine, updateCartLine } from "@/lib/order";
import { useCart } from "@/hooks/useCart";
import { QuantityStepper } from "./QuantityStepper";
import { OrderStepper } from "./OrderStepper";

// internal routes navigate client-side (and prefetch) — same pattern as ui/Button.tsx
const MotionLink = m.create(Link);

export function CartFlow() {
  const { cart } = useCart();
  const copy = orderFlowConfig.cart;
  const { subtotal } = cartBreakdown(cart);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-28 text-center md:px-8 md:pt-36">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{copy.eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{copy.emptyTitle}</h1>
        <p className="mt-2 text-sm text-muted">{copy.emptySubtitle}</p>
        <Link
          href="/menu"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-background"
        >
          {copy.browseCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-28 md:px-8 md:pb-24 md:pt-36">
      <div className="flex justify-center">
        <OrderStepper current={1} />
      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{copy.eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{copy.title}</h1>

      <ul className="mt-8 space-y-4">
        {cart.map((line) => {
          const item = getMenuItem(line.itemId);
          if (!item) return null;
          const addOnLabels = line.addOnIds.map((id) => getAddOn(id)?.label).filter(Boolean);
          const sizeLabel = item.sizes?.find((s) => s.id === line.sizeId)?.label;

          return (
            <li key={line.lineId} className="flex gap-4 rounded-2xl border border-foreground/10 bg-surface p-4">
              <div className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-xl bg-background">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display font-bold">{item.name}</p>
                  <p className="shrink-0 font-semibold tabular-nums text-accent">{formatPrice(lineSubtotal(item, line))}</p>
                </div>
                {(sizeLabel || line.removedIngredients.length > 0 || addOnLabels.length > 0 || item.hasSpiceLevel) && (
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {sizeLabel && `${sizeLabel}. `}
                    {line.removedIngredients.length > 0 && `No ${line.removedIngredients.join(", ")}. `}
                    {item.hasSpiceLevel && `${line.spiceLevel} spice. `}
                    {addOnLabels.length > 0 && `+ ${addOnLabels.join(", ")}`}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityStepper value={line.quantity} onChange={(quantity) => updateCartLine(line.lineId, { quantity })} />
                  <button
                    type="button"
                    onClick={() => removeCartLine(line.lineId)}
                    className="min-h-11 px-2 text-sm font-medium text-muted transition-colors hover:text-primary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Link
        href="/menu"
        className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        + {copy.continueShoppingCta}
      </Link>

      {/* sticky checkout bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-background/90 px-5 pt-3 backdrop-blur-xl md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
        <div className="mb-3 hidden items-center justify-between text-sm text-muted md:flex">
          <span>{copy.subtotalLabel}</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <MotionLink
          href="/checkout"
          whileTap={{ scale: 0.98 }}
          className="flex min-h-14 w-full items-center justify-between rounded-full bg-primary px-6 font-semibold text-background"
        >
          <span>{copy.checkoutCta}</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </MotionLink>
      </div>
    </div>
  );
}
