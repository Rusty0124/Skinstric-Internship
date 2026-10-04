import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev only — the default bottom-left sat on top of NavFooter's Back and ate its clicks. top-right only covers the not-yet-wired Enter Code
  devIndicators: { position: "top-right" },
};

export default nextConfig;
