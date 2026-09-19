"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { m } from "framer-motion";
import { getAddOn } from "@/data/addons";
import { getMenuItem } from "@/data/menu";
import { orderFlowConfig } from "@/config/orderFlow";
import { formatPrice } from "@/lib/format";
import {
  cartBreakdown,
  clearCart,
  getCartServerSnapshot,
  lineSubtotal,
  onCartChanged,
  readCart,
  savePlacedOrder,
  type Fulfillment,
} from "@/lib/order";
import { OrderStepper } from "./OrderStepper";
import { CurtainLink } from "@/components/transitions/CurtainLink";
import { useCurtainNav } from "@/components/transitions/PageCurtain";

export function CheckoutFlow() {
  const router = useRouter();
  const navigate = useCurtainNav();
  const copy = orderFlowConfig.checkout;
  // useSyncExternalStore (not useState+useEffect): the first client render must match the
  // server-rendered HTML (an empty cart), or a hard reload here throws a hydration error.
  const cart = useSyncExternalStore(onCartChanged, readCart, getCartServerSnapshot);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  // set right before a successful submit clears the cart — an empty cart at that point is
  // expected, not a skipped step, so it must NOT bounce us back to /cart mid-navigation
  const submittedRef = useRef(false);

  // empty cart → the customize/cart steps were skipped (direct link, cleared storage, an
  // already-placed order, etc.) — send back rather than showing a broken/empty checkout.
  useEffect(() => {
    if (cart.length === 0 && !submittedRef.current) router.replace("/cart");
  }, [cart, router]);

  if (cart.length === 0) {
    return <div className="min-h-[60vh]" aria-hidden />; // brief blank beat while redirecting
  }

  const { subtotal, deliveryFee, total } = cartBreakdown(cart, fulfillment);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submittedRef.current = true;
    savePlacedOrder({
      lines: cart,
      customerName: name,
      phone,
      fulfillment,
      address: fulfillment === "delivery" ? address : "",
      notes,
      placedAt: Date.now(),
    });
    clearCart();
    navigate("/order-status");
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-28 md:px-8 md:pb-24 md:pt-36">
      <CurtainLink href="/cart" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
        ← {copy.editCta}
      </CurtainLink>
      <div className="mt-5 flex justify-center">
        <OrderStepper current={2} />
      </div>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{copy.eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{copy.title}</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="order-2 space-y-6 md:order-1">
          <fieldset className="space-y-4">
            <legend className="font-display text-lg font-bold">{copy.detailsTitle}</legend>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-muted">{copy.nameLabel}</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-foreground/15 bg-surface px-4 text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-muted">{copy.phoneLabel}</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-foreground/15 bg-surface px-4 text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-lg font-bold">{copy.fulfillmentTitle}</legend>
            <div role="radiogroup" aria-label={copy.fulfillmentTitle} className="flex gap-2">
              {(["pickup", "delivery"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={fulfillment === option}
                  onClick={() => setFulfillment(option)}
                  className={`min-h-11 flex-1 rounded-full border text-sm font-semibold capitalize transition-colors ${
                    fulfillment === option
                      ? "border-primary bg-primary text-background"
                      : "border-foreground/15 text-foreground/80 hover:border-foreground/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {fulfillment === "delivery" && (
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-muted">{copy.addressLabel}</span>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-foreground/15 bg-surface px-4 text-foreground outline-none transition-colors focus:border-primary"
                />
              </label>
            )}
          </fieldset>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-muted">{copy.notesLabel}</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-foreground/15 bg-surface px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>
        </div>

        <div className="order-1 h-fit rounded-2xl border border-foreground/10 bg-surface p-5 md:order-2 md:p-6">
          <h2 className="font-display text-lg font-bold">{copy.summaryTitle}</h2>

          <ul className="mt-4 space-y-4">
            {cart.map((line) => {
              const item = getMenuItem(line.itemId);
              if (!item) return null;
              const selectedAddOns = line.addOnIds.map((id) => getAddOn(id)).filter((a) => !!a);
              const sizeLabel = item.sizes?.find((s) => s.id === line.sizeId)?.label;

              return (
                <li key={line.lineId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">
                      {line.quantity} × {item.name}
                    </p>
                    <p className="shrink-0 tabular-nums text-accent">{formatPrice(lineSubtotal(item, line))}</p>
                  </div>
                  {(sizeLabel || line.removedIngredients.length > 0 || item.hasSpiceLevel || selectedAddOns.length > 0) && (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {sizeLabel && `${sizeLabel}. `}
                      {line.removedIngredients.length > 0 && `No ${line.removedIngredients.join(", ")}. `}
                      {item.hasSpiceLevel && `${line.spiceLevel} spice. `}
                      {selectedAddOns.length > 0 && `+ ${selectedAddOns.map((a) => a.label).join(", ")}`}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 space-y-1.5 border-t border-foreground/10 pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>{copy.subtotalLabel}</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{copy.deliveryFeeLabel}</span>
              <span className="tabular-nums">{deliveryFee > 0 ? formatPrice(deliveryFee) : "—"}</span>
            </div>
            <div className="flex justify-between pt-1.5 font-display text-base font-bold">
              <span>{copy.totalLabel}</span>
              <span className="tabular-nums text-accent">{formatPrice(total)}</span>
            </div>
          </div>

          <m.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="mt-6 min-h-14 w-full rounded-full bg-primary font-semibold text-background"
          >
            {copy.placeCta}
          </m.button>
        </div>
      </form>
    </div>
  );
}
