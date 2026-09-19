/**
 * Shared paid add-ons catalog for the order-customize flow (src/app/order/[itemId]).
 * Menu items reference these by id (see `addOnIds` in menu.ts) rather than repeating the
 * same "extra cheese" definition on every item — edit a price here and every item using it
 * updates.
 */
export type AddOn = { id: string; label: string; price: number };

export const addOns: AddOn[] = [
  { id: "extra-cheese", label: "Extra cheese", price: 1.5 },
  { id: "extra-patty", label: "Extra patty", price: 3.5 },
  { id: "bacon", label: "Crispy bacon", price: 2.0 },
  { id: "avocado", label: "Avocado", price: 1.5 },
  { id: "jalapenos", label: "Jalapeños", price: 1.0 },
  { id: "extra-sauce", label: "Extra house sauce", price: 0.5 },
  { id: "grilled-chicken", label: "Grilled chicken", price: 2.5 },
];

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}
