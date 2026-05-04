/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Vercel deployment configuration
  async rewrites() {
    return [
      {
        source: '/_/backend/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/backend/:path*'
          : 'http://localhost:5000/:path*',
      },
    ];
  },
}

export default nextConfig
