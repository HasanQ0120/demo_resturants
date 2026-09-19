"use client";

type Props = { value: number; onChange: (next: number) => void; min?: number; max?: number };

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-foreground/15">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid size-11 place-items-center rounded-full text-lg font-semibold text-foreground/80 transition-colors hover:text-foreground disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center font-display text-lg font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-11 place-items-center rounded-full text-lg font-semibold text-foreground/80 transition-colors hover:text-foreground disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
