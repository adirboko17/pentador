import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
