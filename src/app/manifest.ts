import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Next.js serves this automatically at /manifest.webmanifest and wires up
// the <link rel="manifest"> tag itself — no manual reference needed in
// layout.tsx metadata.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0D12",
    theme_color: "#0B0D12",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
