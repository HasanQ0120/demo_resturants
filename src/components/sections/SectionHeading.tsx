import { Reveal } from "@/components/motion/Reveal";

type Props = { eyebrow: string; title: string; subtitle?: string; className?: string };

export function SectionHeading({ eyebrow, title, subtitle, className = "" }: Props) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="text-balance font-display text-[clamp(2.25rem,7vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
