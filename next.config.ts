import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: ".",
  },
  // Extra hardening for the task board, which takes in files and links from
  // outside. Scoped to /tools so the rest of the site (analytics, remote
  // images) is untouched.
  //
  // The page never renders outside text as HTML, so there is nothing to
  // inject into today. This policy is the second layer, limiting what a page
  // could do if a bug ever let something through: no plugins, no <base>
  // hijacking, no framing, no form hijacking, images/fonts/styles only from
  // this site (or inline), and — in production — scripts only from this site
  // and network requests only back to this site, so nothing could load more
  // code from elsewhere or send data out. (Next.js relies on inline scripts,
  // so 'unsafe-inline' is still needed for script-src; the dev server also
  // needs eval and websockets for hot reload, so it gets the lighter policy.)
  async headers() {
    const base = [
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob:",
    ];
    const strict = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "worker-src 'self' blob:",
    ];
    const policy = (
      process.env.NODE_ENV === "production" ? [...strict, ...base] : base
    ).join("; ");
    return [
      {
        source: "/tools/:path*",
        headers: [
          { key: "Content-Security-Policy", value: policy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          // Private, password-protected tools: keep them out of search.
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
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
