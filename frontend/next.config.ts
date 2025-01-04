import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // Assuming the image URL uses HTTPS
        hostname: "gateway.lighthouse.storage",
      },
    ],
  },
};

export default nextConfig;
