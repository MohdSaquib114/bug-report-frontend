import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The widget is a linked (file:) dependency that lives outside this app's
     root. Turbopack needs the additional root to follow the symlink. */
  experimental: {
    turbopackAdditionalRoots: {
      bugWidgetLibrary: { path: "../bug-widget-library" },
    },
  },
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