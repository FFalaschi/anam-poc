import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Vercel serverless deployment
};

export default nextConfig;
