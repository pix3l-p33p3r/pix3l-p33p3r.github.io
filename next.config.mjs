/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy - Prevents XSS attacks
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          // X-Content-Type-Options - Prevents MIME-sniffing attacks
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // X-Frame-Options - Prevents clickjacking attacks
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // X-XSS-Protection - Legacy XSS protection header
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer-Policy - Controls referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions-Policy - Controls browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Strict-Transport-Security - Forces HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
}

export default nextConfig
