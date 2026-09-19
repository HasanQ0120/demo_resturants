import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function OrderCTA() {
  const { orderCta, contact } = siteConfig;
  return (
    <section id="order" className="px-5 py-20 md:px-8 md:py-28">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-background md:px-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[9rem] font-extrabold leading-none opacity-10 md:text-[14rem]"
        >
          {siteConfig.brand.shortName}
        </div>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-balance font-display text-[clamp(2.25rem,8vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              {orderCta.title}
            </h2>
            <p className="mt-4 text-base font-medium opacity-80 md:text-lg">{orderCta.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Button href="/menu" variant="dark" className="w-full md:w-auto">
              {orderCta.button}
            </Button>
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="py-1 text-center text-sm font-medium opacity-80 hover:opacity-100 md:text-right"
            >
              or call {contact.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
