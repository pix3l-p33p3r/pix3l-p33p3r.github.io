import type React from "react"
import { Suspense } from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Telemetry from "@/components/telemetry"
import { VercelObservability } from "@/components/vercel-observability"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} Portfolio`,
  description: `${SITE_NAME} Portfolio - Cyberpunk Developer & Hardware Enthusiast`,
  generator: "Next.js",
  keywords: ["developer", "portfolio", "cyberpunk", "hardware", "programming", "1337"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: `${SITE_NAME} Portfolio`,
    description: "Cyberpunk-themed portfolio showcasing projects in systems, hardware, and DevSecOps.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og/default.svg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Portfolio`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} Portfolio`,
    description: "Cyberpunk-themed portfolio showcasing projects in systems, hardware, and DevSecOps.",
    images: ["/og/default.svg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0mIlpdmpFLNeF2a/9tfuQR2harD4W4+1FHnpuFx22FN93NM8v3Gr6IIH5xWg+S"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${shareTechMono.className} bg-black text-white overflow-x-hidden relative leading-relaxed`}>
        {/* Skip to content for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {/* CRT Scanline Effect */}
        <div className="fixed inset-0 bg-scanline pointer-events-none z-50 animate-scanline" aria-hidden="true"></div>
        {/* CRT Flicker Effect */}
        <div
          className="fixed inset-0 bg-transparent pointer-events-none z-[60] animate-flicker"
          aria-hidden="true"
        ></div>
        {children}
        <VercelObservability Analytics={Analytics} SpeedInsights={SpeedInsights} />
        <Suspense fallback={null}>
          <Telemetry />
        </Suspense>
      </body>
    </html>
  )
}
