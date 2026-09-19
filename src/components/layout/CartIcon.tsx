"use client";

import { useCart } from "@/hooks/useCart";
import { CurtainLink } from "@/components/transitions/CurtainLink";

export function CartIcon({ className = "" }: { className?: string }) {
  const { count } = useCart();

  return (
    <CurtainLink
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className={`relative grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-foreground/5 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
        <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden
          className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-background"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </CurtainLink>
  );
}
