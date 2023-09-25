/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  webpack: (config, { isServer, buildId, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Add this to mock 'fs'
        encoding: false, // Add this to mock 'encoding'
      };
    }
    return config;
  },
};

