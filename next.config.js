/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal image config for faster builds
  images: {
    domains: ['images.unsplash.com'],
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