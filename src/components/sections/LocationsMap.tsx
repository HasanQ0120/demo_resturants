"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { siteConfig } from "@/config/site";
import { locations } from "@/data/locations";

// Esri's public "World Dark Gray" canvas basemap — free, no API key/signup needed. (CARTO's
// equivalent free tiles now require a key and watermark unkeyed requests, so avoid those.)
const TILE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION =
  '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> &mdash; Esri, HERE, Garmin, OpenStreetMap contributors';

function pinIcon(color: string) {
  return L.divIcon({
    className: "location-pin",
    html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13 21.7 14 22.6.6.5 1.4.5 2 0C17 36.7 30 25.5 30 15 30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="6" fill="#0b0908"/>
    </svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 36],
    popupAnchor: [0, -34],
  });
}

/**
 * Homepage locations map — Leaflet + OpenStreetMap/CARTO tiles, no API key required, so this
 * works immediately for any client with zero signup. Swap the pins in src/data/locations.ts.
 * Scroll-zoom stays off until the map is clicked/tapped, so it never traps page scrolling.
 */
export default function LocationsMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    mapRef.current = map;

    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 16, maxNativeZoom: 16 }).addTo(map);

    const icon = pinIcon(siteConfig.theme.accent);
    for (const loc of locations) {
      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${loc.name}</strong><br/>${loc.address}`);
    }

    // click/tap to "activate" scroll-zoom, so hovering the map doesn't hijack page scroll
    map.on("click", () => map.scrollWheelZoom.enable());
    el.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="size-full" />;
}
