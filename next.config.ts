import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "crop.postsyncapp.com",
            },
          ],
          destination: "/crop",
        },
      ],
    };
  },
};

export default nextConfig;