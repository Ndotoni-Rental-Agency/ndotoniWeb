/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from all domains (useful for user-generated content and CDNs)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Specific domains for better performance (Next.js can optimize these better)
    domains: [
      'images.unsplash.com',
      'd1i6oti6o90wzi.cloudfront.net', // Your CloudFront CDN
      'photos.zillowstatic.com',
      'images.pexels.com',
      'via.placeholder.com'
    ],
  },
  
  // Only add optimizations in production
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true,
    },
  }),

  // Minimal webpack config
  webpack: (config, { dev }) => {
    // Only add bundle analyzer when explicitly requested and not in dev
    if (process.env.ANALYZE === 'true' && !dev) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;