import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
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
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "crop.postsyncapp.com",
            },
          ],
          destination: "/crop.html",
        },
        { source: "/adcheck", destination: "/adcheck.html" },
        { source: "/place", destination: "/place.html" },
        { source: "/crop", destination: "/crop.html" },
        { source: "/byte", destination: "/byte.html" },
        { source: "/hwpx", destination: "/hwpx.html" },
        { source: "/utm", destination: "/utm.html" },
        { source: "/convert", destination: "/convert.html" },
      ],
      afterFiles: [
        { source: "/crop", destination: "/crop.html" },
        { source: "/place", destination: "/place.html" },
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
