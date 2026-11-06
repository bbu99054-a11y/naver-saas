import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "crop.postsyncapp.com",
          },
        ],
        destination: "https://www.postsyncapp.com/crop",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "tools.postsyncapp.com",
          },
        ],
        destination: "https://www.postsyncapp.com/tools",
        permanent: true,
      },
      {
        source: "/tools/adcheck",
        destination: "/adcheck",
        permanent: true,
      },
      {
        source: "/thumbscan",
        destination: "/convert",
        permanent: true,
      },
      {
        source: "/seo-check",
        destination: "/place",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/place",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "/place",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/place",
        permanent: true,
      },
      {
        source: "/consult",
        destination: "/place",
        permanent: true,
      },
      {
        source: "/onboarding",
        destination: "/place",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/adcheck", destination: "/adcheck.html" },
        { source: "/place", destination: "/place.html" },
        { source: "/reply", destination: "/reply.html" },
        { source: "/crop", destination: "/crop.html" },
        { source: "/byte", destination: "/byte.html" },
        { source: "/hwpx", destination: "/hwpx.html" },
        { source: "/utm", destination: "/utm.html" },
        { source: "/convert", destination: "/convert.html" },
      ],
      afterFiles: [
        { source: "/crop", destination: "/crop.html" },
        { source: "/place", destination: "/place.html" },
        { source: "/reply", destination: "/reply.html" },
        { source: "/adcheck", destination: "/adcheck.html" },
        { source: "/byte", destination: "/byte.html" },
        { source: "/hwpx", destination: "/hwpx.html" },
        { source: "/utm", destination: "/utm.html" },
        { source: "/convert", destination: "/convert.html" },
      ],
    };
  },
};

export default nextConfig;
