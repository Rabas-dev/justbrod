import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // React dev mode needs eval() for its debugging tools; never used in production builds.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  // Dev-mode HMR needs a websocket connection back to the local dev server.
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // /admin/scan needs the camera; everything else is denied by default.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.join(process.cwd()),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
