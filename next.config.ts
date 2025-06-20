import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  sassOptions: {
    implementation: "sass-embedded",
  },

  images: {
    remotePatterns: [
      {
        hostname: "crafatar.com",
      },
    ],
  },
};

export default nextConfig;
