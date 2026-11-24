import type { NextConfig } from "next";

// Static export for GitHub Pages (https://gerald-ger.github.io).
// Cache Components and Partial Prefetching are off: they need a Node.js server,
// which a static export does not have.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
