function umamiCspOrigins() {
  const origins = new Set(["https://cloud.umami.is", "https://api.umami.is", "https://*.umami.is"])
  const raw = process.env.NEXT_PUBLIC_UMAMI_URL?.trim()
  if (raw) {
    try {
      origins.add(new URL(raw).origin)
    } catch {
      // Invalid public URL is ignored at build time; tracker simply will not load.
    }
  }
  return [...origins].join(" ")
}

const umamiOrigins = umamiCspOrigins()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/cv/pix3l_p33p3r_resume.pdf",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/admin",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // Note: 'unsafe-inline' is still required for Next.js / KaTeX; tighten further when possible.
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com ${umamiOrigins}; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com ${umamiOrigins}; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
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
