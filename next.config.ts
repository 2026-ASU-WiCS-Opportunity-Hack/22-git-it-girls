import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Supabase Storage if used in future
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
