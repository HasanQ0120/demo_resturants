import { getMenuItem, type MenuItem } from "@/data/menu";
import { getAddOn } from "@/data/addons";
import { orderFlowConfig } from "@/config/orderFlow";

export type SpiceLevel = "mild" | "medium" | "hot";
export type Fulfillment = "pickup" | "delivery";

/** Selections made on the customize step for one menu item. */
export type OrderCustomization = {
  itemId: string;
  quantity: number;
  removedIngredients: string[];
  addOnIds: string[];
  spiceLevel: SpiceLevel;
  /** Chosen size id, for items with `sizes` (e.g. pizza). Undefined for items without sizes. */
  sizeId?: string;
};

/** One line in the cart — a customization plus a stable id, since the same item can be
 * added twice with different choices (e.g. two Classic Smashes, one with extra cheese). */
export type CartLineItem = OrderCustomization & { lineId: string };
export type Cart = CartLineItem[];

/** A submitted, cart-wide order — what the status page tracks. */
export type PlacedOrder = {
  lines: CartLineItem[];
  customerName: string;
  phone: string;
  fulfillment: Fulfillment;
  address: string;
  notes: string;
  placedAt: number;
};

const CART_KEY = "bb-cart";
const PLACED_ORDER_KEY = "bb-placed-order";
/** Fired on every cart write so components (e.g. the navbar badge) can react within the same tab. */
const CART_CHANGED_EVENT = "bb-cart-changed";

function writeJSON(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (private mode, storage full, etc.) — the flow still
    // works within a single page; only cross-page continuity is lost.
  }
}

function newLineId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

const EMPTY_CART: Cart = [];
let cartRawCache: string | null = null;
let cartValueCache: Cart = EMPTY_CART;

/**
 * Reads the cart, returning the SAME array reference if sessionStorage hasn't actually
 * changed since the last read. That stability is required to use this directly as a
 * `useSyncExternalStore` snapshot (see hooks/useCart.ts) — without it, every read would look
 * like a change and the hook would re-render forever.
 */
export function readCart(): Cart {
  if (typeof window === "undefined") return cartValueCache;
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(CART_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cartRawCache) {
    cartRawCache = raw;
    cartValueCache = raw ? (JSON.parse(raw) as Cart) : EMPTY_CART;
  }
  return cartValueCache;
}

/** `useSyncExternalStore`'s server snapshot — SSR has no sessionStorage, so this must be a
 * stable empty cart, never a fresh `[]` (which would fail its reference-equality check). */
export function getCartServerSnapshot(): Cart {
  return EMPTY_CART;
}

function writeCart(cart: Cart) {
  writeJSON(CART_KEY, cart);
  cartRawCache = JSON.stringify(cart);
  cartValueCache = cart;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
}

/** Subscribe to cart changes made anywhere in this tab. Returns an unsubscribe function. */
export function onCartChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CART_CHANGED_EVENT, handler);
}

export function addToCart(item: OrderCustomization) {
  const cart = readCart();
  cart.push({ ...item, lineId: newLineId() });
  writeCart(cart);
}

export function updateCartLine(lineId: string, patch: Partial<OrderCustomization>) {
  const cart = readCart().map((line) => (line.lineId === lineId ? { ...line, ...patch } : line));
  writeCart(cart);
}

export function removeCartLine(lineId: string) {
  writeCart(readCart().filter((line) => line.lineId !== lineId));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(cart: Cart = readCart()): number {
  return cart.reduce((sum, line) => sum + line.quantity, 0);
}

/** Per-line unit price (base item + size delta + its add-ons), ignoring quantity. */
export function lineUnitPrice(item: MenuItem, line: OrderCustomization): number {
  const sizeDelta = item.sizes?.find((s) => s.id === line.sizeId)?.priceDelta ?? 0;
  const addOnsTotal = line.addOnIds.reduce((sum, id) => sum + (getAddOn(id)?.price ?? 0), 0);
  return item.price + sizeDelta + addOnsTotal;
}

export function lineSubtotal(item: MenuItem, line: OrderCustomization): number {
  return lineUnitPrice(item, line) * line.quantity;
}

/** Cart-wide totals. Lines referencing a since-removed menu item are skipped defensively. */
export function cartBreakdown(cart: Cart, fulfillment: Fulfillment = "pickup") {
  const subtotal = cart.reduce((sum, line) => {
    const item = getMenuItem(line.itemId);
    return item ? sum + lineSubtotal(item, line) : sum;
  }, 0);
  const deliveryFee = fulfillment === "delivery" && cart.length > 0 ? orderFlowConfig.checkout.deliveryFee : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export function defaultCustomization(item: MenuItem): OrderCustomization {
  return {
    itemId: item.id,
    quantity: 1,
    removedIngredients: [],
    addOnIds: [],
    spiceLevel: "medium",
    sizeId: item.sizes?.[0]?.id,
  };
}

let placedOrderRawCache: string | null = null;
let placedOrderValueCache: PlacedOrder | null = null;

export function savePlacedOrder(order: PlacedOrder) {
  writeJSON(PLACED_ORDER_KEY, order);
  placedOrderRawCache = JSON.stringify(order);
  placedOrderValueCache = order;
}

/** Same reference-stability note as readCart() — needed for useSyncExternalStore. */
export function readPlacedOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return placedOrderValueCache;
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(PLACED_ORDER_KEY);
  } catch {
    raw = null;
  }
  if (raw !== placedOrderRawCache) {
    placedOrderRawCache = raw;
    placedOrderValueCache = raw ? (JSON.parse(raw) as PlacedOrder) : null;
  }
  return placedOrderValueCache;
}

export function getPlacedOrderServerSnapshot(): PlacedOrder | null {
  return null;
}
