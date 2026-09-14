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
        { source: "/adcheck", destination: "/adcheck.html" },
        { source: "/place", destination: "/place.html" },
        { source: "/crop", destination: "/crop.html" },
        { source: "/byte", destination: "/byte.html" },
        { source: "/hwpx", destination: "/hwpx.html" },
        { source: "/utm", destination: "/utm.html" },
        { source: "/convert", destination: "/convert.html" },
      ],
    };
  },
};

export default nextConfig;