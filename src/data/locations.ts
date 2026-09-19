/**
 * Restaurant locations shown on the homepage map (LocationsMap.tsx).
 * PLACEHOLDER coordinates — swap in the client's real addresses/lat-lng before launch.
 * Get real coordinates by right-clicking a spot on Google Maps and copying the lat,lng shown.
 */
export type RestaurantLocation = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export const locations: RestaurantLocation[] = [
  { id: "downtown", name: "Brand Burger — Downtown", address: "123 Main Street, Your City", lat: 30.2686, lng: -97.7455 },
  { id: "eastside", name: "Brand Burger — Eastside", address: "48 Riverside Ave, Your City", lat: 30.2621, lng: -97.7312 },
  { id: "north", name: "Brand Burger — North", address: "910 Parkway Blvd, Your City", lat: 30.2802, lng: -97.7401 },
];
