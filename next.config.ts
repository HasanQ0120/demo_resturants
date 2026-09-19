import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    // Next 16 blocks query strings on local /public images by default (a security default —
    // see images.localPatterns in the docs). We use `?v=<mtime>` to cache-bust swapped assets
    // (see src/lib/asset-version.ts), so opt back in. `search` is intentionally omitted to allow
    // any query value; these src values are always hardcoded local paths, never user input.
    localPatterns: [{ pathname: "**" }],
  },
};

export default nextConfig;
