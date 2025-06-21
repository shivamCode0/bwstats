import type { NextConfig } from "next";

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
};

export default nextConfig;
