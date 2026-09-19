"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { getAddOn } from "@/data/addons";
import { getMenuItem } from "@/data/menu";
import { orderFlowConfig } from "@/config/orderFlow";
import { formatPrice } from "@/lib/format";
import { cartBreakdown, getPlacedOrderServerSnapshot, lineSubtotal, readPlacedOrder } from "@/lib/order";
import { OrderStepper } from "./OrderStepper";
import { BikeIcon, CheckIcon, FlameIcon } from "./StatusIcons";

const icons = [CheckIcon, FlameIcon, BikeIcon];
const stages = orderFlowConfig.status.stages;
// nothing else writes the placed order while this page is open, so there's nothing to subscribe to
const noSubscription = () => () => {};

/** Cart-wide order tracker — reads the order placed at /checkout, not tied to one item. */
export function OrderStatusTracker() {
  const router = useRouter();
  const copy = orderFlowConfig.status;
  const reducedMotion = useReducedMotion();
  // useSyncExternalStore (not useState+useEffect): the first client render must match the
  // server-rendered HTML (no order), or a hard reload here throws a hydration error.
  const order = useSyncExternalStore(noSubscription, readPlacedOrder, getPlacedOrderServerSnapshot);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!order) router.replace("/menu");
  }, [order, router]);

  // auto-advance through the stages; the last stage (durationMs: 0) holds indefinitely
  useEffect(() => {
    const duration = stages[stageIndex]?.durationMs;
    if (!duration) return;
    const id = setTimeout(() => setStageIndex((i) => Math.min(i + 1, stages.length - 1)), duration);
    return () => clearTimeout(id);
  }, [stageIndex]);

  if (!order) {
    return <div className="min-h-[60vh]" aria-hidden />;
  }

  const { total } = cartBreakdown(order.lines, order.fulfillment);
  const current = stages[stageIndex];
  const onFinalStage = stageIndex === stages.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <div className="flex justify-center">
        <OrderStepper current={3} />
      </div>

      <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {order.customerName ? `Thanks, ${order.customerName.split(" ")[0]}!` : copy.title}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{copy.title}</h1>
        <p className="mt-2 text-sm text-muted">{copy.subtitle}</p>
      </m.div>

      {/* horizontal tracker: icons connected by lines that fill in step with each stage's real timer */}
      <div className="mt-12 flex items-start justify-center">
        {stages.map((stage, i) => {
          const Icon = icons[i];
          const state = i < stageIndex ? "done" : i === stageIndex ? "current" : "upcoming";
          const isLast = i === stages.length - 1;
          return (
            <div key={stage.id} className="flex items-start">
              <div className="flex w-16 flex-col items-center text-center sm:w-24">
                <div className="relative grid place-items-center">
                  {state === "current" && !reducedMotion && (
                    <m.span
                      aria-hidden
                      className="absolute size-14 rounded-full bg-primary/40 blur-md sm:size-16"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.15, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <m.span
                    initial={false}
                    animate={state === "done" ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.45, ease: "backOut" }}
                    className={`relative grid size-11 shrink-0 place-items-center rounded-full sm:size-12 ${
                      state === "upcoming" ? "border border-foreground/15 text-muted" : "bg-primary text-background"
                    }`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </m.span>
                </div>
                <p className={`mt-3 text-xs font-bold sm:text-sm ${state === "upcoming" ? "text-muted" : ""}`}>{stage.label}</p>
              </div>
              {!isLast && (
                // fills over THIS stage's own duration — i.e. while it's current — landing on
                // 100% exactly as the timer advances to the next stage (see the effect above)
                <div className="relative mt-5 h-px w-7 shrink-0 overflow-hidden bg-foreground/15 sm:mt-6 sm:w-16">
                  <m.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    initial={false}
                    animate={{ width: stageIndex >= i ? "100%" : "0%" }}
                    transition={{ duration: reducedMotion ? 0 : (stage.durationMs || 400) / 1000, ease: "linear" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* the current stage's detail, as a headline moment that crossfades as it advances */}
      <div className="relative mt-8 h-12 text-center">
        <AnimatePresence mode="wait">
          <m.p
            key={current.id}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0 font-display text-lg font-bold sm:text-xl"
          >
            {current.detail}
          </m.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 rounded-2xl border border-foreground/10 bg-surface p-5 md:p-6">
        <ul className="space-y-3">
          {order.lines.map((line) => {
            const item = getMenuItem(line.itemId);
            if (!item) return null;
            const addOnLabels = line.addOnIds.map((id) => getAddOn(id)?.label).filter(Boolean);
            const sizeLabel = item.sizes?.find((s) => s.id === line.sizeId)?.label;
            return (
              <li key={line.lineId} className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {line.quantity} × {item.name}
                  </p>
                  {(sizeLabel || addOnLabels.length > 0) && (
                    <p className="text-xs text-muted">
                      {sizeLabel && `${sizeLabel}${addOnLabels.length > 0 ? " · " : ""}`}
                      {addOnLabels.length > 0 && `+ ${addOnLabels.join(", ")}`}
                    </p>
                  )}
                </div>
                <p className="shrink-0 font-display font-bold tabular-nums text-accent">
                  {formatPrice(lineSubtotal(item, line))}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-foreground/10 pt-3">
          <p className="text-xs capitalize text-muted">
            {order.fulfillment}
            {order.fulfillment === "delivery" && order.address ? ` · ${order.address}` : ""}
          </p>
          <p className="shrink-0 font-display font-bold tabular-nums">{formatPrice(total)}</p>
        </div>
      </div>

      {onFinalStage && (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
          <Link href="/menu" className="text-sm font-semibold text-primary hover:underline">
            {copy.newOrderCta} →
          </Link>
        </m.div>
      )}
    </div>
  );
}
