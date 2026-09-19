/**
 * Central brand + content config.
 * Swap these values per restaurant client — every component reads from here.
 */

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "x" | "youtube";

export const siteConfig = {
  brand: {
    name: "Brand Burger",
    shortName: "BB",
    tagline: "Smash-grilled. Stacked high. Made to order.",
    description:
      "Premium smash burgers built from fresh-ground beef, toasted brioche and house sauces — cooked to order and ready in minutes.",
    logo: "/logo.svg",
    url: "https://example.com",
  },

  locale: "en-US",
  currency: "USD",

  /** International format, digits only (e.g. 15551234567). Leave empty to disable WhatsApp links. */
  whatsapp: {
    number: "15551234567",
    defaultMessage: "Hi! I'd like to place an order.",
  },

  contact: {
    phone: "+1 (555) 123-4567",
    email: "hello@example.com",
    address: "123 Main Street, Your City",
    mapUrl: "https://maps.google.com/?q=123+Main+Street",
    hours: [
      { days: "Mon – Thu", time: "11:00 – 22:00" },
      { days: "Fri – Sat", time: "11:00 – 00:00" },
      { days: "Sunday", time: "12:00 – 21:00" },
    ],
  },

  socials: [
    { platform: "instagram", url: "https://instagram.com/" },
    { platform: "facebook", url: "https://facebook.com/" },
    { platform: "tiktok", url: "https://tiktok.com/" },
  ] satisfies { platform: SocialPlatform; url: string }[],

  /** Main navigation. `href` values starting with "/" are routes; "/#id" jumps to a section on the home page. */
  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/#about" },
    { label: "Policies", href: "/policy" },
  ],

  hero: {
    eyebrow: "Now open · Dine-in & delivery",
    titleLines: ["Burgers", "worth the", "mess."],
    subtitle:
      "Double-smashed patties, melted cheese and pillowy brioche. Order in seconds, straight to your phone.",
    primaryCta: "Order Now",
    secondaryCta: "View Menu",
    dragHint: "Drag to spin",
  },

  menuSection: {
    eyebrow: "The Menu",
    title: "Built to crave",
    subtitle: "Everything's cooked fresh to order. Tap any item to order it on WhatsApp.",
  },

  /** Home-page teaser: shows the items flagged `featured` in src/data/menu.ts. */
  featuredSection: {
    eyebrow: "Signatures",
    title: "The ones they come back for",
    subtitle: "A few favourites from the griddle. The full menu has the rest.",
    cta: "View Full Menu",
  },

  /** Homepage map section — see src/data/locations.ts for the actual pins. */
  locationsSection: {
    eyebrow: "Find Us",
    title: "Walk-ins welcome",
    subtitle: "Pop by any of our spots, or order ahead and skip the queue.",
  },

  about: {
    eyebrow: "Our Story",
    title: "Simple food, done obsessively well.",
    paragraphs: [
      "We started with one griddle and a simple idea: a burger should be crispy at the edges, juicy in the middle and worth every napkin.",
      "Today we still grind our beef daily, bake-toast every bun and make every sauce in house. No shortcuts — just great burgers.",
    ],
    stats: [
      { value: 50, suffix: "k+", label: "Burgers served" },
      { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 },
      { value: 12, suffix: "min", label: "Avg. prep time" },
    ],
    features: [
      { title: "Fresh daily", text: "Beef ground in-house every morning." },
      { title: "Local produce", text: "Crisp veg from nearby farms." },
      { title: "House sauces", text: "Signature recipes, made from scratch." },
    ],
  },

  orderCta: {
    title: "Hungry? Let's fix that.",
    subtitle: "Send us your order on WhatsApp and we'll have it hot and ready.",
    button: "Order on WhatsApp",
  },

  /** Brand palette — injected as CSS variables and used by Tailwind (bg-primary, text-muted, …). */
  theme: {
    background: "#0b0908",
    surface: "#17120f",
    primary: "#ff5a1f",
    accent: "#ffc53d",
    foreground: "#f7efe6",
    muted: "#a89a8c",
  },

  /** Colors for the procedural 3D burger in the hero (keep them muted: realistic food tones read as premium). */
  burger3D: {
    bun: "#a8683a",
    bunBottom: "#a26b40",
    crumb: "#d9c09a",
    seeds: "#e0d3b8",
    patty: "#3b2519",
    cheese: "#d99a3e",
    lettuce: "#5c8438",
    tomato: "#a5392d",
    /** warm rim light behind the burger */
    rimLight: "#ff9d63",
  },
} as const;

export type SiteConfig = typeof siteConfig;
