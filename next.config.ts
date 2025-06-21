import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */

  // sassOptions: {
  //   implementation: "sass-embedded",
  // },

  images: {
    remotePatterns: [
      {
        hostname: "crafatar.com",
      },
      {
        hostname: "minotar.net",
      },
      {
        hostname: "hypixel.net",
      },
      {
        hostname: "mc-heads.net",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "cdn.hypixel.net",
      },
    ],
  },

  experimental: {
    ppr: isDev ? false : "incremental",
  },
  typescript: {
    ignoreBuildErrors: true, // This is not recommended for production, but useful for development
  },
  eslint: {
    ignoreDuringBuilds: true, // This is not recommended for production, but useful for development
  },
};

export default nextConfig;
