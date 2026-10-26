import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a static copy for preview hosting (no contact API).
const exportMode = process.env.PREVIEW_EXPORT === "1";

const config: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  ...(exportMode ? { output: "export" as const, images: { unoptimized: true } } : {}),
};

export default config;
