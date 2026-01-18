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
      'd2bstvyam1bm1f.cloudfront.net', // Additional CloudFront CDN
      'photos.zillowstatic.com',
      'images.pexels.com',
      'via.placeholder.com'
    ],
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Only add optimizations in production
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true,
    },
    // Enable experimental features for better performance
    experimental: {
      optimizePackageImports: ['@heroicons/react', 'aws-amplify'],
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
    
    // Optimize chunks
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Separate AWS Amplify into its own chunk
          amplify: {
            test: /[\\/]node_modules[\\/](aws-amplify|@aws-amplify|@aws-sdk)[\\/]/,
            name: 'amplify',
            chunks: 'all',
            priority: 30,
          },
          // React and core libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 25,
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
          // Common code shared between pages
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;