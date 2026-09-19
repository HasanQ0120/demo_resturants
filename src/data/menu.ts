/**
 * Menu content. Swap items/images per client.
 * Images live in /public/menu (4:3, e.g. 1200x900). Replace with the client's photos, keeping the same paths, or update `image`.
 */

export type MenuCategory = { id: string; label: string };

/** One size choice for items like pizza — `priceDelta` is added to the base price. */
export type SizeOption = { id: string; label: string; priceDelta: number };

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory["id"];
  image: string;
  badge?: string;
  featured?: boolean;
  /**
   * Default included ingredients, shown as removable toggles on the order-customize page
   * (src/app/order/[itemId]). Omit or leave empty for items with nothing to remove (drinks).
   */
  ingredients?: string[];
  /** Add-on ids from src/data/addons.ts offered when customizing this item. */
  addOnIds?: string[];
  /** Shows a Mild/Medium/Hot picker on the customize page. Free — doesn't affect price. */
  hasSpiceLevel?: boolean;
  /** Shows a size picker on the customize page (e.g. pizza). `price` is the first size's price. */
  sizes?: SizeOption[];
};

export const categories: MenuCategory[] = [
  { id: "all", label: "All" },
  { id: "burgers", label: "Burgers" },
  { id: "pizza", label: "Pizza" },
  { id: "pasta", label: "Pasta" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
];

export const menuItems: MenuItem[] = [
  {
    id: "classic-smash",
    name: "Classic Smash",
    description: "Double smashed beef, American cheese, pickles, onion, house sauce.",
    price: 11.5,
    category: "burgers",
    image: "/menu/classic-smash.webp",
    badge: "Bestseller",
    featured: true,
    ingredients: ["American cheese", "Pickles", "Onion", "House sauce"],
    addOnIds: ["extra-cheese", "extra-patty", "bacon", "jalapenos"],
    hasSpiceLevel: true,
  },
  {
    id: "bacon-stack",
    name: "Bacon Stack",
    description: "Two patties, crispy bacon, cheddar, caramelised onion, smoky BBQ.",
    price: 13.9,
    category: "burgers",
    image: "/menu/bacon-stack.webp",
    featured: true,
    ingredients: ["Crispy bacon", "Cheddar", "Caramelised onion", "Smoky BBQ sauce"],
    addOnIds: ["extra-cheese", "extra-patty", "jalapenos"],
    hasSpiceLevel: true,
  },
  {
    id: "hot-honey-chicken",
    name: "Hot Honey Chicken",
    description: "Buttermilk fried chicken, hot honey glaze, slaw, pickles.",
    price: 12.5,
    category: "burgers",
    image: "/menu/hot-honey-chicken.webp",
    badge: "Spicy",
    featured: true,
    ingredients: ["Hot honey glaze", "Slaw", "Pickles"],
    addOnIds: ["extra-cheese", "bacon", "extra-sauce"],
    hasSpiceLevel: true,
  },
  {
    id: "garden-deluxe",
    name: "Garden Deluxe",
    description: "Plant-based patty, vegan cheese, tomato, lettuce, garlic aioli.",
    price: 12,
    category: "burgers",
    image: "/menu/garden-deluxe.webp",
    badge: "Vegan",
    ingredients: ["Vegan cheese", "Tomato", "Lettuce", "Garlic aioli"],
    addOnIds: ["avocado", "jalapenos", "extra-sauce"],
    hasSpiceLevel: true,
  },
  {
    id: "pepperoni-classic",
    name: "Pepperoni Classic",
    description: "Hand-stretched dough, slow-simmered tomato sauce, mozzarella, cup-and-char pepperoni.",
    price: 14.5,
    category: "pizza",
    image: "/menu/pepperoni-classic.webp",
    badge: "Bestseller",
    ingredients: ["Mozzarella", "Tomato sauce", "Pepperoni"],
    addOnIds: ["extra-cheese", "jalapenos", "grilled-chicken"],
    hasSpiceLevel: true,
    sizes: [
      { id: "medium", label: "Medium (10\")", priceDelta: 0 },
      { id: "large", label: "Large (14\")", priceDelta: 4 },
    ],
  },
  {
    id: "garden-supreme-pizza",
    name: "Garden Supreme",
    description: "Rocket, cherry tomato, red onion, mozzarella, olive oil, shaved parmesan.",
    price: 13.9,
    category: "pizza",
    image: "/menu/garden-supreme-pizza.webp",
    badge: "Vegetarian",
    ingredients: ["Mozzarella", "Rocket", "Cherry tomato", "Red onion", "Parmesan"],
    addOnIds: ["extra-cheese", "avocado", "jalapenos"],
    sizes: [
      { id: "medium", label: "Medium (10\")", priceDelta: 0 },
      { id: "large", label: "Large (14\")", priceDelta: 4 },
    ],
  },
  {
    id: "spicy-diavola",
    name: "Spicy Diavola",
    description: "Nduja sausage, fiery salami, mozzarella, chilli oil, tomato sauce.",
    price: 15.5,
    category: "pizza",
    image: "/menu/spicy-diavola.webp",
    badge: "Spicy",
    ingredients: ["Mozzarella", "Tomato sauce", "Salami", "Chilli oil"],
    addOnIds: ["extra-cheese", "grilled-chicken"],
    hasSpiceLevel: true,
    sizes: [
      { id: "medium", label: "Medium (10\")", priceDelta: 0 },
      { id: "large", label: "Large (14\")", priceDelta: 4 },
    ],
  },
  {
    id: "beef-lasagna",
    name: "Classic Beef Lasagna",
    description: "Layered pasta sheets, slow-braised beef ragù, béchamel, baked mozzarella.",
    price: 14.9,
    category: "pasta",
    image: "/menu/beef-lasagna.webp",
    ingredients: ["Beef ragù", "Béchamel", "Mozzarella"],
    addOnIds: ["extra-cheese", "extra-sauce"],
    hasSpiceLevel: true,
  },
  {
    id: "alfredo-penne",
    name: "Creamy Alfredo Penne",
    description: "Penne tossed in a silky parmesan-cream sauce, cracked black pepper.",
    price: 12.9,
    category: "pasta",
    image: "/menu/alfredo-penne.webp",
    ingredients: ["Parmesan cream sauce", "Black pepper"],
    addOnIds: ["grilled-chicken", "extra-cheese"],
  },
  {
    id: "arrabbiata-penne",
    name: "Spicy Arrabbiata",
    description: "Penne in a chilli-spiked tomato sauce, garlic, basil, shaved parmesan.",
    price: 12.5,
    category: "pasta",
    image: "/menu/arrabbiata-penne.webp",
    badge: "Spicy",
    ingredients: ["Tomato sauce", "Garlic", "Basil", "Parmesan"],
    addOnIds: ["grilled-chicken", "extra-cheese"],
    hasSpiceLevel: true,
  },
  {
    id: "loaded-fries",
    name: "House Fries",
    description: "Double-cooked golden fries, sea salt, house seasoning.",
    price: 6.5,
    category: "sides",
    image: "/menu/loaded-fries.webp",
    ingredients: ["Sea salt", "House seasoning"],
    addOnIds: ["extra-cheese", "extra-sauce"],
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    description: "Beer-battered rings with chipotle mayo.",
    price: 5.5,
    category: "sides",
    image: "/menu/onion-rings.webp",
    ingredients: ["Chipotle mayo"],
    addOnIds: ["extra-sauce"],
  },
  {
    id: "vanilla-shake",
    name: "Vanilla Shake",
    description: "Thick-spun vanilla bean ice cream, whipped cream.",
    price: 5.9,
    category: "drinks",
    image: "/menu/vanilla-shake.webp",
  },
  {
    id: "craft-soda",
    name: "Craft Soda",
    description: "Rotating house sodas — ask for today's flavours.",
    price: 3.5,
    category: "drinks",
    image: "/menu/craft-soda.webp",
  },
];

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((i) => i.id === id);
}
