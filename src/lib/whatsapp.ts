import { siteConfig } from "@/config/site";

/** Builds a wa.me link with a prefilled message. Falls back to the on-page order section. */
export function buildWhatsAppLink(message: string = siteConfig.whatsapp.defaultMessage) {
  const number = siteConfig.whatsapp.number.replace(/\D/g, "");
  if (!number) return "#order";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderItemMessage(itemName: string) {
  return `Hi! I'd like to order: ${itemName}`;
}
