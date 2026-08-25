import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — replace <your-project-ref> or set via env if you prefer.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // used only by seed/placeholder data
      },
    ],
  },
  eslint: {
    // Keep builds from failing on lint warnings during early development.
    // Remove once the codebase is stable.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
