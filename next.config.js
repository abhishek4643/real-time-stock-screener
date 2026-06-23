/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignore ESLint during production build (we run it separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TS errors during build for faster iteration (we have strict tsconfig)
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['ws'],
  },
};

module.exports = nextConfig;
