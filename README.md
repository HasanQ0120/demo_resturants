# Burger Restaurant: Demo Template

A dark, mobile-first, multi-page restaurant site built with Next.js 16, with a photographic hero (a light pointer-tilt on desktop) and scroll animations (Framer Motion). Ordering menu items adds them to a shared cart, then walks through a full cart → checkout → status flow in-site (see [Order flow](#order-flow-front-end-only)); generic "Order Now" buttons not tied to one item (navbar, hero, sticky mobile bar, the CTA band) send people to the menu to start that flow. A WhatsApp link builder (`src/lib/whatsapp.ts`) still ships in the project, unused, in case a client wants a "message us to order" fallback instead.

A fully procedural, code-only 3D burger (React Three Fiber — no model files, no textures) also lives in the codebase, unused by default. See [3D burger (currently unused)](#3d-burger-currently-unused) if you want to bring it back.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | File | Contents |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | hero photo → featured items (teaser) → about → locations map → order CTA |
| `/menu` | `src/app/menu/page.tsx` | full menu: category tabs, filtering, all cards |
| `/order/[itemId]` | `src/app/order/[itemId]/page.tsx` | customize a specific menu item, then add it to the cart |
| `/cart` | `src/app/cart/page.tsx` | every added item, with quantity/remove controls — supports multiple different items at once |
| `/checkout` | `src/app/checkout/page.tsx` | order summary (all cart lines) + name/phone/pickup-or-delivery + notes |
| `/order-status` | `src/app/order-status/page.tsx` | confirmed → cooking → rider status for the whole order, auto-advancing |
| `/policy` | `src/app/policy/page.tsx` | Privacy Policy, Terms of Service, Refund & Cancellation |

The navbar, footer and mobile order bar live in `src/app/layout.tsx`, so every page gets them. Navigation links come from `siteConfig.nav`; the current page is underlined (and colored in the mobile menu). The home teaser shows the menu items flagged `featured: true`, capped at three.

**The legal pages are placeholder text** (`src/config/legal.ts`) — generic filler, not legal advice. Replace it with the client's reviewed policies before launch, and update `legalConfig.lastUpdated`.

## Customizing for a client

All client-specific content lives in four places. Components read from these, so you shouldn't need to edit any component.

| What | Where |
| --- | --- |
| Name, tagline, all copy, contact details, hours, social links, nav links | `src/config/site.ts` |
| Brand colors (used through Tailwind as `bg-primary`, `text-muted`, …) | `siteConfig.theme` in `src/config/site.ts` |
| 3D burger colors (only matters if you re-enable the 3D hero) | `siteConfig.burger3D` in `src/config/site.ts` |
| WhatsApp number and default message (currently unused — see the note at the top of this file) | `siteConfig.whatsapp` (digits only, with country code; leave empty to disable) |
| Currency and number format | `siteConfig.currency` / `siteConfig.locale` |
| Menu items and categories | `src/data/menu.ts` — currently Burgers, Pizza, Pasta, Sides, Drinks. Add a category by adding it to the `categories` array, then give items that `category` id |
| Per-item size options (e.g. pizza Medium/Large), each with a `priceDelta` added to the base price | `sizes` on a `MenuItem` in `src/data/menu.ts` — omit for items with one fixed size; the customize page only shows a size picker when `sizes` is set |
| Add-ons offered when customizing an order | `src/data/addons.ts` |
| Restaurant locations shown on the homepage map | `src/data/locations.ts`: placeholder addresses/coordinates — get real lat/lng by right-clicking a spot on Google Maps |
| Fonts | `src/config/fonts.ts` (any `next/font/google` font) |
| Logo | `public/logo.svg` (or change `brand.logo`) |
| Menu images | `public/menu/*.webp`: 4:3 photos (1200×900). Replace the files, or point `image` at new ones. The current ones are Unsplash placeholders (see `PHOTO-CREDITS.md` for the burgers/sides/drinks, `PHOTO-CREDITS-2.md` for pizza/pasta) |
| Hero backdrop, behind the hero photo | `public/hero-bg.jpg`: a wide, dark, out-of-focus image (about 2000×1200). The current file is a generated gradient placeholder — overwrite it. Delete it and the hero falls back to gradients alone, with no broken image |
| **Hero photo — the main hero visual** | `public/hero-poster.webp`: a product shot on a transparent (or matching-dark) background, roughly square, ideally 1000×1000 or larger. Replace this file to change the hero image |
| Favicon | `src/app/favicon.ico` |

**Swapping a hero image without a rebuild:** hero images are cache-busted automatically (`src/lib/asset-version.ts`) — overwrite `hero-poster.webp` or `hero-bg.jpg` with a **new file that keeps the same filename**, and visitors see the change immediately, no cache clearing or redeploy needed. (This exists because Next's image optimizer otherwise caches each resized/converted image on disk for up to 4 hours, keyed by URL — not by the file's contents.)

## How it stays fast on phones

- **No 3D download, on any device:** the hero is a photo (`HeroPhoto.tsx`), so `three`/`@react-three/fiber`/`@react-three/drei`/`@react-three/postprocessing` are never imported by the active pages and don't ship in the bundle at all — verified in `.next/static/chunks`.
- **Hero interactivity, without the weight:** on desktop, moving the mouse over the hero photo tilts it slightly in pseudo-3D (spring-eased, via Framer Motion `rotateX`/`rotateY`). Mouse only — touch devices (phones) get the static photo with no listener, so it never fights page scrolling.
- **Fast first paint:** the hero text is server-rendered and animated with CSS, so it appears before any JavaScript runs.
- **Smaller framer-motion bundle:** it loads through `LazyMotion` with the `domAnimation` feature set.
- **Reduced motion:** users who have turned on "reduce motion" get no hero tilt, and no scroll-in animations.

## Order flow (front-end only)

Clicking "Order" on a specific menu item (not the generic navbar/hero/CTA buttons — see the top of this file) walks through a real cart:

1. **`/order/[itemId]`** (`CustomizeFlow.tsx`) — remove default ingredients (they're listed per item in `src/data/menu.ts`), pick a size if the item has one (pizza), pick a spice level, add paid extras (`src/data/addons.ts`), set quantity. Price updates live. "Add to Cart" adds this as one line and returns to `/cart` — customizing another item adds a second, independent line, so ordering a burger and a pizza together (or two of the same item with different spice levels) both work as separate lines in one cart.
2. **`/cart`** (`CartFlow.tsx`) — every line added so far, each with its own quantity stepper and remove button, plus a running subtotal. "+ Add more items" goes back to `/menu` without losing what's already in the cart.
3. **`/checkout`** (`CheckoutFlow.tsx`) — order summary across all lines with a full price breakdown, name/phone, pickup or delivery (address shown only for delivery), optional kitchen notes.
4. **`/order-status`** (`OrderStatusTracker.tsx`) — "Order placed!", then auto-advances through **Confirmed → Cooking → Rider on the way** on a timer (durations in `src/config/orderFlow.ts`), holding on the final stage. The horizontal progress line between stages fills in real time, synced to each stage's own duration. Shows every line from the placed order, not just one item.

The navbar's cart icon (`CartIcon.tsx`) shows a live count badge from anywhere on the site and links straight to `/cart`.

**This has no real backend.** The cart and placed order live in `sessionStorage` (`src/lib/order.ts`) — there's no database, no kitchen notification, no real rider. Visiting `/checkout` with an empty cart, or `/order-status` with no placed order, redirects back rather than showing broken/empty content. Wire up a real backend (order storage, kitchen notification, live courier tracking) before taking real orders — `orderFlowConfig.disclaimer` in `orderFlow.ts` has the same reminder inline.

## Locations map

The map on the homepage (`LocationsSection.tsx` / `LocationsMap.tsx`) is Leaflet + a free public basemap — **no API key or signup required**, so it works immediately for any client. Tiles are Esri's "World Dark Gray" canvas (`https://server.arcgisonline.com/.../World_Dark_Gray_Base/...`), darkened further with a CSS filter to match the brand palette; markers are a custom SVG pin colored from `siteConfig.theme.accent`. It's lazy-loaded (`next/dynamic({ ssr: false })`) so Leaflet never ships in the main bundle, and scroll-wheel zoom stays off until the map is clicked, so hovering it never hijacks page scrolling.

Edit `src/data/locations.ts` for the real addresses — the current ones are fake (a real street grid, so the map looks like a real place, but not this restaurant's actual locations). Get real coordinates by right-clicking a spot on Google Maps and copying the `lat, lng` it shows. One entry renders one pin; delete two if the client has a single location.

**A note on the tile provider:** CARTO's basemap tiles (a once-common free choice) now require an API key and watermark unkeyed requests — don't switch to those without adding a key. If Esri's terms or availability ever change, MapTiler and Stadia Maps both offer dark styles on a free tier, but both require signing up for an API key first.

## 3D burger (currently unused)

An earlier iteration of this template used a fully procedural, code-only 3D burger (no model or texture files — geometry, noise-based surface detail, and baked vertex colors, all generated in JS) as the interactive hero centerpiece, with phone/desktop quality tiers and adaptive performance. It was replaced by a real product photo because a stylized low-poly model reads as "the cheap one" sitting next to an actual photograph — but the component is untouched and still works if a future project wants it (e.g. no real photo is available yet, or a fully interactive 360° view matters more than photographic fidelity).

The code lives in `src/components/three/`:

| File | Role |
| --- | --- |
| `Burger.tsx` | the procedural mesh — bun, patty, cheese, lettuce, tomato, sesame seeds |
| `HeroScene.tsx` | the `<Canvas>`: lighting, drag-to-rotate, quality-tier switching, `PerformanceMonitor` |
| `Effects.tsx` | postprocessing (bloom, vignette) — high tier only, lazy-loaded separately |
| `HeroFallback.tsx` | the poster shown while the 3D chunk loads |
| `HeroCanvasLoader.tsx` | orchestrates all of the above: phone → poster only; desktop → poster, then lazy-loads and fades into the 3D scene once idle/in view |
| `quality.ts` | tier detection (phone/touch/low-core → low; else high), reduced-motion and WebGL checks |

To bring it back: in `Hero.tsx`, swap `<HeroPhoto src={posterSrc} />` for `<HeroCanvasLoader posterSrc={posterSrc} />` (its import was removed — re-add `import { HeroCanvasLoader } from "@/components/three/HeroCanvasLoader";`). Tune the model's colors via `siteConfig.burger3D`.

## Traced frame (the light that circles the featured cards)

The glowing line that continuously travels around the "Signatures" card row (`FeaturedMenu.tsx`) is `TracedFrame.tsx` — an animated SVG `<rect>` (using `pathLength={100}` so the visible segment is a plain percentage of the perimeter) with a moving `stroke-dashoffset`, not a CSS gradient trick. That matters for corners: a masked conic-gradient can misrender at rounded corners, while a real path traces them cleanly by construction. No WebGL, cheap enough to run on every device including phones — unlike the 3D burger or LaserFlow below, it needs no capability gating. It measures its own box via `ResizeObserver`, so it fits any size/aspect ratio. Tune it via its `duration` prop (seconds per full loop) and `radius` (px, keep in sync with the wrapper's own `rounded-*` class); color comes from `siteConfig.theme.accent`. Wrap any content in `<TracedFrame>…</TracedFrame>` to reuse it elsewhere. Respects `prefers-reduced-motion` (freezes instead of animating).

## LaserFlow (currently unused)

`src/components/effects/LaserFlow.tsx` is a vendored [React Bits](https://reactbits.dev) component — a WebGL shader "laser beam" with volumetric fog and animated wisps (ported to TypeScript here, shader math unchanged). It was tried as an ambient glow first behind the Order CTA, then behind the featured cards, but a beam-shaped light source can't be tuned into "a line that traces around and frames" something — that's a structurally different effect (see Traced frame, above) — so it isn't used anywhere on the site now. The component itself is untouched and works if a future project wants an actual beam-of-light effect (e.g. a hero backdrop). Mount it via `next/dynamic({ ssr: false })`, gate it behind `detectTier() === "high"` + `hasWebGL()` + `!prefersReducedMotion()` (see `src/components/three/quality.ts`) so it never downloads on phones, and lazy-load it behind an `IntersectionObserver` so it doesn't cost anything until its section is actually in view — the now-removed `HeroCanvasLoader.tsx` above is a worked example of that same lazy/gated pattern.

## Structure

```
src/
  app/            layout (theme variables, fonts, metadata) + page
  config/         site.ts (brand + content), fonts.ts
  data/           menu.ts
  lib/            formatPrice, WhatsApp link builder
  components/
    layout/       Navbar, MobileOrderBar, Footer
    sections/     Hero, HeroPhoto, HeroBackdrop, Menu, MenuCard, About, OrderCTA
    motion/       Reveal helpers
    ui/           Button
    three/        procedural 3D burger — currently unused, see "3D burger" above
```
