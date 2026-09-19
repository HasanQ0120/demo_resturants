"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { m } from "framer-motion";
import type { MenuItem } from "@/data/menu";
import { addOns } from "@/data/addons";
import { orderFlowConfig } from "@/config/orderFlow";
import { formatPrice } from "@/lib/format";
import { addToCart, defaultCustomization, lineSubtotal, type SpiceLevel } from "@/lib/order";
import { QuantityStepper } from "./QuantityStepper";

const spiceLevels: { id: SpiceLevel; label: string }[] = [
  { id: "mild", label: "Mild" },
  { id: "medium", label: "Medium" },
  { id: "hot", label: "Hot" },
];

export function CustomizeFlow({ item }: { item: MenuItem }) {
  const router = useRouter();
  const copy = orderFlowConfig.customize;
  const [state, setState] = useState(() => defaultCustomization(item));

  const itemAddOns = addOns.filter((a) => item.addOnIds?.includes(a.id));
  const total = lineSubtotal(item, state);

  const toggleIngredient = (name: string) =>
    setState((s) => ({
      ...s,
      removedIngredients: s.removedIngredients.includes(name)
        ? s.removedIngredients.filter((n) => n !== name)
        : [...s.removedIngredients, name],
    }));

  const toggleAddOn = (id: string) =>
    setState((s) => ({
      ...s,
      addOnIds: s.addOnIds.includes(id) ? s.addOnIds.filter((a) => a !== id) : [...s.addOnIds, id],
    }));

  const handleAddToCart = () => {
    addToCart(state);
    router.push("/cart");
  };

  // for a single-item order — adds it, then skips straight to checkout instead of the cart page
  const handleBuyNow = () => {
    addToCart(state);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-28 md:px-8 md:pb-24 md:pt-36">
      <Link href="/menu" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
        ← {copy.backCta}
      </Link>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{copy.eyebrow}</p>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative aspect-square w-full max-w-[10rem] shrink-0 overflow-hidden rounded-2xl bg-surface">
          <Image src={item.image} alt={item.name} fill sizes="160px" className="object-cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{item.name}</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{item.description}</p>
          <p className="mt-2 font-display text-lg font-bold text-accent">{formatPrice(item.price)}</p>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {!!item.sizes?.length && (
          <section>
            <h2 className="font-display text-lg font-bold">Size</h2>
            <div role="radiogroup" aria-label="Size" className="mt-4 flex gap-2">
              {item.sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  role="radio"
                  aria-checked={state.sizeId === size.id}
                  onClick={() => setState((s) => ({ ...s, sizeId: size.id }))}
                  className={`min-h-11 flex-1 rounded-full border px-3 text-sm font-semibold transition-colors ${
                    state.sizeId === size.id
                      ? "border-primary bg-primary text-background"
                      : "border-foreground/15 text-foreground/80 hover:border-foreground/30"
                  }`}
                >
                  {size.label}
                  {size.priceDelta > 0 && ` +${formatPrice(size.priceDelta)}`}
                </button>
              ))}
            </div>
          </section>
        )}

        {!!item.ingredients?.length && (
          <section>
            <h2 className="font-display text-lg font-bold">{copy.ingredientsTitle}</h2>
            <p className="mt-1 text-xs text-muted">{copy.ingredientsHint}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.ingredients.map((ing) => {
                const removed = state.removedIngredients.includes(ing);
                return (
                  <li key={ing}>
                    <button
                      type="button"
                      onClick={() => toggleIngredient(ing)}
                      aria-pressed={!removed}
                      className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                        removed
                          ? "border-foreground/10 text-muted line-through decoration-2"
                          : "border-primary/40 bg-primary/10 text-foreground"
                      }`}
                    >
                      {ing}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {item.hasSpiceLevel && (
          <section>
            <h2 className="font-display text-lg font-bold">{copy.spiceTitle}</h2>
            <div role="radiogroup" aria-label={copy.spiceTitle} className="mt-4 flex gap-2">
              {spiceLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  role="radio"
                  aria-checked={state.spiceLevel === level.id}
                  onClick={() => setState((s) => ({ ...s, spiceLevel: level.id }))}
                  className={`min-h-11 flex-1 rounded-full border text-sm font-semibold transition-colors ${
                    state.spiceLevel === level.id
                      ? "border-primary bg-primary text-background"
                      : "border-foreground/15 text-foreground/80 hover:border-foreground/30"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {!!itemAddOns.length && (
          <section>
            <h2 className="font-display text-lg font-bold">{copy.addOnsTitle}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {itemAddOns.map((addOn) => {
                const checked = state.addOnIds.includes(addOn.id);
                return (
                  <li key={addOn.id}>
                    <button
                      type="button"
                      onClick={() => toggleAddOn(addOn.id)}
                      aria-pressed={checked}
                      className={`flex min-h-14 w-full items-center justify-between rounded-2xl border px-4 text-left transition-colors ${
                        checked ? "border-primary bg-primary/10" : "border-foreground/15 hover:border-foreground/30"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={`grid size-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                            checked ? "border-primary bg-primary text-background" : "border-foreground/30"
                          }`}
                        >
                          {checked && "✓"}
                        </span>
                        <span className="text-sm font-medium">{addOn.label}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-accent">
                        +{formatPrice(addOn.price)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-display text-lg font-bold">{copy.quantityTitle}</h2>
          <div className="mt-4">
            <QuantityStepper value={state.quantity} onChange={(quantity) => setState((s) => ({ ...s, quantity }))} />
          </div>
        </section>
      </div>

      {/* sticky continue bar — "Add to Cart" for building a bigger order, "Order Now" to skip
          the cart page entirely and go straight to checkout with just this one item */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-foreground/10 bg-background/90 px-5 pt-3 backdrop-blur-xl md:static md:mt-12 md:border-0 md:bg-transparent md:p-0">
        <m.button
          type="button"
          onClick={handleAddToCart}
          whileTap={{ scale: 0.98 }}
          className="flex min-h-14 flex-1 items-center justify-center rounded-full border border-foreground/20 px-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
        >
          {copy.continueCta}
        </m.button>
        <m.button
          type="button"
          onClick={handleBuyNow}
          whileTap={{ scale: 0.98 }}
          className="flex min-h-14 flex-[1.4] items-center justify-between rounded-full bg-primary px-6 font-semibold text-background"
        >
          <span>{copy.buyNowCta}</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </m.button>
      </div>
    </div>
  );
}
