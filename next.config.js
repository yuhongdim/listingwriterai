/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  output: 'standalone',
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig