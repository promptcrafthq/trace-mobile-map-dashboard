/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ['192.168.50.55'],
  },
};

module.exports = nextConfig;
