import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // This application is served as a Next.js multi-zone below vaptinsights.com.
  // Keep its generated assets separate from the main VAPT Insights application.
  assetPrefix: "/hub-static",
};

export default nextConfig;
