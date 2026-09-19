import Image from "next/image";

/**
 * The hero's photographic burger.
 *
 * Used two ways:
 *  - on phones / touch devices it IS the hero visual (no 3D is loaded at all)
 *  - on desktop it shows until the 3D scene has rendered, then cross-fades out
 *
 * /public/hero-poster.webp should be a transparent cutout (no background), roughly square.
 */
type HeroFallbackProps = { src?: string; loading?: boolean; priority?: boolean };

export function HeroFallback({ src = "/hero-poster.webp", loading = false, priority = true }: HeroFallbackProps) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div aria-hidden className="animate-glow absolute size-3/5 rounded-full bg-primary/15 blur-3xl" />
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, min(100vw, 34rem)"
        className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)]"
      />
      {loading && (
        <div role="status" className="absolute bottom-10 flex items-center gap-1.5">
          <span className="sr-only">Loading 3D preview</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-glow size-1.5 rounded-full bg-foreground/60"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1.2s" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
