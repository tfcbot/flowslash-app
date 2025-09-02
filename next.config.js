/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Disable ESLint during builds since we're using Biome
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    '*',
  ],
}

module.exports = nextConfig
