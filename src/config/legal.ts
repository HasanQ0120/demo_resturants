/**
 * PLACEHOLDER legal copy for the /policy page.
 *
 * This is generic filler so the page has structure — it is NOT legal advice and must be
 * replaced with the client's reviewed policies before the site goes live.
 * Keep the heading structure; swap the paragraphs.
 */

export type LegalSection = {
  id: string;
  title: string;
  summary: string;
  blocks: { heading: string; body: string }[];
};

export const legalConfig = {
  eyebrow: "Legal",
  title: "Policies & terms",
  subtitle:
    "How we handle your data, the terms you agree to when ordering, and how refunds and cancellations work.",
  lastUpdated: "2026-09-17",
  contactNote: "Questions about any of this? Contact us using the details in the footer.",
};

export const legalSections: LegalSection[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    summary:
      "We collect the minimum information needed to take and deliver your order, and we do not sell it.",
    blocks: [
      {
        heading: "Information we collect",
        body: "When you place an order we may collect your name, phone number, delivery address and the contents of your order. If you contact us through a messaging service, we receive the messages you send us. We may also collect basic, anonymous statistics about how this website is used.",
      },
      {
        heading: "How we use your information",
        body: "We use your information to prepare and deliver your order, to contact you about that order, and to keep records required for accounting and tax purposes. With your consent, we may also send you occasional offers, and you can opt out at any time.",
      },
      {
        heading: "Sharing with third parties",
        body: "We share information only with the services needed to fulfil your order, such as delivery partners and payment processors. We do not sell your personal information. Messaging platforms used to place orders handle your messages under their own privacy policies.",
      },
      {
        heading: "Cookies and analytics",
        body: "This website may use cookies or similar technologies to remember your preferences and to understand which pages are visited. You can block cookies in your browser settings, though some parts of the site may then work differently.",
      },
      {
        heading: "Data retention and your rights",
        body: "We keep order records for as long as the law requires, then delete them. You may ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it, subject to our legal obligations.",
      },
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    summary: "The terms you agree to when you use this website or place an order with us.",
    blocks: [
      {
        heading: "Using this website",
        body: "By browsing this website or placing an order, you agree to these terms. You agree to provide accurate contact and delivery details and not to misuse the site or interfere with its operation.",
      },
      {
        heading: "Orders and acceptance",
        body: "An order is a request until we confirm it. We may decline or cancel an order, for example if an item is unavailable, the delivery address is outside our area, or we cannot verify your details. Quoted preparation and delivery times are estimates, not guarantees.",
      },
      {
        heading: "Prices, menu and availability",
        body: "Prices and menu items are shown in the currency stated at checkout and may change without notice. Items can sell out. Photographs are for illustration and the food served may differ in appearance.",
      },
      {
        heading: "Allergens and food safety",
        body: "Our kitchen handles common allergens, so we cannot guarantee any item is free from traces of them. Please tell us about allergies or dietary requirements before ordering so we can advise you.",
      },
      {
        heading: "Intellectual property",
        body: "The branding, text, photography and design on this website belong to us or our licensors and may not be reused without permission.",
      },
      {
        heading: "Liability",
        body: "To the extent permitted by law, our liability for any order is limited to the amount you paid for it. Nothing in these terms limits liability that cannot be limited by law.",
      },
      {
        heading: "Changes to these terms",
        body: "We may update these terms from time to time. The version published on this page at the time of your order is the one that applies.",
      },
    ],
  },
  {
    id: "refunds",
    title: "Refund & Cancellation Policy",
    summary: "What happens if you need to change or cancel an order, or if something goes wrong.",
    blocks: [
      {
        heading: "Changing or cancelling an order",
        body: "Contact us as soon as possible if you need to change or cancel an order. We can usually help if preparation has not started. Once food is being prepared, an order may no longer be cancellable.",
      },
      {
        heading: "If something is wrong with your order",
        body: "If an item is missing, incorrect or arrives in poor condition, contact us within a reasonable time of delivery and, where possible, keep the item. We will arrange a replacement or a refund for the affected items.",
      },
      {
        heading: "How refunds are issued",
        body: "Approved refunds are returned using the original payment method. The time it takes to appear depends on your bank or payment provider.",
      },
      {
        heading: "Non-refundable situations",
        body: "We may be unable to refund orders where incorrect delivery details were supplied, where nobody was available to receive the delivery, or where a complaint is raised long after the order was delivered.",
      },
      {
        heading: "How to reach us",
        body: "Use the phone number, email address or messaging link in the footer of this site. Please have your order details ready so we can help quickly.",
      },
    ],
  },
];
