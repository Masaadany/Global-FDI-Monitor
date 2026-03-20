/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Frame-Options',        value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
];

const nextConfig = {
  output:         'export',
  trailingSlash:  true,
  reactStrictMode:true,
  poweredByHeader:false,
  // Security headers applied at CDN/server level for static export
  // headers: async () => [{ source:'/(.*)', headers: securityHeaders }],
  images:         { unoptimized: true },
  typescript:     { ignoreBuildErrors: true },
};
module.exports = nextConfig;
