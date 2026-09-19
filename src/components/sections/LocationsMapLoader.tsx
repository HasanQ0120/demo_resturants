"use client";

import dynamic from "next/dynamic";

const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center">
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading map">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-glow size-1.5 rounded-full bg-foreground/60"
            style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1.2s" }}
          />
        ))}
      </div>
    </div>
  ),
});

export function LocationsMapLoader() {
  return <LocationsMap />;
}
