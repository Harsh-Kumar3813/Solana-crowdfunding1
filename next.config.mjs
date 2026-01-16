/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
