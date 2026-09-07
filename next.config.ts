import type { NextConfig } from "next";

// Per-developer ngrok domain, e.g. for `DEV_ALLOWED_ORIGIN=foo.ngrok-free.dev npm run dev` —
// never hardcode a personal tunnel domain here, it's regenerated per ngrok session and
// breaks for every other developer who pulls this file.
const devOrigin = process.env.DEV_ALLOWED_ORIGIN;

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  allowedDevOrigins: devOrigin ? [devOrigin] : [],
};

export default nextConfig;
