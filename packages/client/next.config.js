/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jacando.com",
        pathname: "/wp-content/uploads/2021/01/jacando_logo_neg-768x169.png",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/graphql/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
