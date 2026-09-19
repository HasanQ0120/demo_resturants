import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { bodyFont, displayFont } from "@/config/fonts";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileOrderBar } from "@/components/layout/MobileOrderBar";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.url),
  title: {
    default: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    template: `%s — ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  openGraph: {
    title: siteConfig.brand.name,
    description: siteConfig.brand.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.theme.background,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const { theme } = siteConfig;
const themeVars = {
  "--brand-background": theme.background,
  "--brand-surface": theme.surface,
  "--brand-primary": theme.primary,
  "--brand-accent": theme.accent,
  "--brand-foreground": theme.foreground,
  "--brand-muted": theme.muted,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={themeVars}
      className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
      // Next 16 stopped auto-overriding scroll-behavior during page navigation (see
      // https://nextjs.org/docs/app/guides/upgrading/version-16#scroll-behavior-override).
      // Without this, navigating to a new page can animate/scroll oddly instead of landing
      // at the top, since scroll-behavior:smooth (globals.css) now also governs Next's own
      // scroll-to-top-on-navigation. This restores that instant-scroll-to-top behavior.
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <Providers>
          {/* Shared chrome: every route gets the nav, footer and mobile order bar. */}
          <div className="grain">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <MobileOrderBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
