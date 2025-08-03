import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@se-2/hardhat"],
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker
  output: "standalone",
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
