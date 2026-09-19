"use client";

import { useSyncExternalStore } from "react";
import { cartCount, getCartServerSnapshot, onCartChanged, readCart, type Cart } from "@/lib/order";

/**
 * Reactive cart contents — updates within this tab whenever addToCart/updateCartLine/etc. run.
 * Uses useSyncExternalStore (not useState+useEffect) so the very first client render already
 * matches the server-rendered HTML (an empty cart, since SSR has no sessionStorage) — reading
 * storage into useState directly would mismatch and trigger a React hydration error whenever
 * a full page load happens with a non-empty cart already saved (e.g. on reload).
 */
export function useCart(): { cart: Cart; count: number } {
  const cart = useSyncExternalStore(onCartChanged, readCart, getCartServerSnapshot);
  return { cart, count: cartCount(cart) };
}
