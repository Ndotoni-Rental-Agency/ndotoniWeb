/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1i6oti6o90wzi.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize build trace collection
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./public/**/*'],
    },
  },
  // Reduce build trace complexity
  outputFileTracing: true,
  // Disable static optimization to prevent useSearchParams issues
  output: 'standalone',
}

module.exports = nextConfig