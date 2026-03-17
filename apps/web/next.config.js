/** @type {import('next').NextConfig} */
const nextConfig = {
  output:         'export',
  trailingSlash:  true,
  reactStrictMode:true,
  poweredByHeader:false,
  images:         { unoptimized: true },
  typescript:     { ignoreBuildErrors: true },
};
module.exports = nextConfig;
