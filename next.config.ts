import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: ".",
  },
  // Extra hardening for the task board, which takes in files and links from
  // outside. Scoped to /tools so the rest of the site (analytics, remote
  // images) is untouched. No script-src rule on purpose — Next.js relies on
  // inline scripts — so this limits what a page could do if something did get
  // through: no plugins, no <base> hijacking, no framing, no form hijacking,
  // images only from this site or inline.
  async headers() {
    return [
      {
        source: "/tools/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob:",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olgith.github.io",
      },
    ],
    qualities: [60, 75],
  },
};

export default nextConfig;
