import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, type SocialPlatform } from "@/config/site";

const socialPaths: Record<SocialPlatform, string> = {
  instagram:
    "M12 2.2c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  facebook:
    "M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07",
  tiktok:
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  x: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z",
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z",
};

export function Footer() {
  const { brand, contact, socials, nav } = siteConfig;
  return (
    <footer id="contact" className="border-t border-foreground/10 bg-surface pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={brand.logo} alt="" width={40} height={40} className="size-10" />
            <span className="font-display text-xl font-bold">{brand.name}</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{brand.tagline}</p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid size-11 place-items-center rounded-full border border-foreground/15 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                    <path d={socialPaths[s.platform]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterCol title="Visit">
          <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            {contact.address}
          </a>
        </FooterCol>

        <FooterCol title="Hours">
          <ul className="space-y-1.5">
            {contact.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="tabular-nums text-foreground/90">{h.time}</span>
              </li>
            ))}
          </ul>
        </FooterCol>

        <FooterCol title="Contact">
          <ul className="space-y-1.5">
            <li>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="inline-block py-1 hover:text-foreground">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-block py-1 hover:text-foreground">
                {contact.email}
              </a>
            </li>
          </ul>
        </FooterCol>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-foreground/10 px-5 pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {nav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-block py-1 hover:text-foreground">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3 text-sm text-muted">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">{title}</h3>
      {children}
    </div>
  );
}
