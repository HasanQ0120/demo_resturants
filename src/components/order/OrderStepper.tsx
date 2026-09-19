const steps = ["Cart", "Checkout", "Track"] as const;

/**
 * Shared 3-step progress indicator across cart → checkout → status. Customizing an item
 * (/order/[itemId]) happens before this journey starts — you can do it for several items in a
 * row before ever reaching the cart — so it isn't one of these steps and doesn't show this.
 */
export function OrderStepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Order progress">
      {steps.map((label, i) => {
        const step = i + 1;
        const state = step < current ? "done" : step === current ? "current" : "upcoming";
        return (
          <li key={label} className="flex items-center gap-2">
            {i > 0 && <span className={`h-px w-4 sm:w-8 ${state === "upcoming" ? "bg-foreground/15" : "bg-primary"}`} />}
            <span
              aria-current={state === "current" ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3 ${
                state === "upcoming" ? "text-muted" : state === "current" ? "bg-primary text-background" : "text-primary"
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center rounded-full text-[10px] ${
                  state === "current"
                    ? "bg-background text-primary"
                    : state === "done"
                      ? "bg-primary text-background"
                      : "border border-foreground/25"
                }`}
              >
                {state === "done" ? "✓" : step}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
