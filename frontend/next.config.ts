import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      { source: "/api/:path*", destination: `${backend}/:path*` },
      { source: "/uploads/:path*", destination: `${backend}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
