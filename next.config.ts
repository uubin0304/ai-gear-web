// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'credivita.com',
        pathname: '/ai/wp-content/uploads/**', // 특정 경로만 허용
      },
      {
        protocol: 'https',
        hostname: 'ai.credivita.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
