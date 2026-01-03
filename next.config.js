/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['d1i6oti6o90wzi.cloudfront.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig