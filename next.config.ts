import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/smart-habit-hub",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
