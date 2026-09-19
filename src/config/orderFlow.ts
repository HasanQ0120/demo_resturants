/**
 * Copy + timing for the in-site order flow: /order/[itemId] (customize) → /cart → /checkout →
 * /order-status. This flow has no real backend — see README ("Order flow (front-end only)").
 */
export const orderFlowConfig = {
  customize: {
    eyebrow: "Customize",
    ingredientsTitle: "Ingredients",
    ingredientsHint: "Tap to remove",
    addOnsTitle: "Add extras",
    spiceTitle: "Spice level",
    quantityTitle: "Quantity",
    continueCta: "Add to Cart",
    backCta: "Back to menu",
  },
  cart: {
    eyebrow: "Your Cart",
    title: "Your order so far",
    emptyTitle: "Your cart is empty",
    emptySubtitle: "Add something from the menu to get started.",
    browseCta: "Browse the menu",
    continueShoppingCta: "Add more items",
    subtotalLabel: "Subtotal",
    checkoutCta: "Checkout",
  },
  checkout: {
    eyebrow: "Checkout",
    title: "Almost there",
    detailsTitle: "Your details",
    nameLabel: "Name",
    phoneLabel: "Phone number",
    fulfillmentTitle: "Pickup or delivery?",
    addressLabel: "Delivery address",
    notesLabel: "Notes for the kitchen (optional)",
    summaryTitle: "Order summary",
    subtotalLabel: "Subtotal",
    deliveryFeeLabel: "Delivery fee",
    totalLabel: "Total",
    editCta: "Edit cart",
    placeCta: "Place order",
    deliveryFee: 2.99,
  },
  status: {
    title: "Order placed!",
    subtitle: "We'll keep this page updated as your order moves.",
    newOrderCta: "Order something else",
    /** Each stage's on-screen time in ms before advancing to the next. The last stage holds. */
    stages: [
      {
        id: "confirmed",
        label: "Order confirmed",
        detail: "Your order has been sent to the kitchen.",
        durationMs: 2600,
      },
      {
        id: "cooking",
        label: "Cooking your order",
        detail: "Fresh on the grill — won't be long now.",
        durationMs: 4200,
      },
      {
        id: "rider",
        label: "Rider is on the way",
        detail: "Your order is out for delivery.",
        durationMs: 0, // final stage — holds here
      },
    ],
  },
  /** This flow simulates the experience only — nothing here reaches a real kitchen or rider. */
  disclaimer:
    "This is a front-end demo of the ordering experience — no order is actually sent anywhere. Wire up a real backend before taking live orders.",
} as const;

export type OrderStageId = (typeof orderFlowConfig.status.stages)[number]["id"];
