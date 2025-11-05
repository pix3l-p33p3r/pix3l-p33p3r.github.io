import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "pix3l_p33p3r Portfolio",
  description: "pix3l_p33p3r Portfolio - Cyberpunk Developer & Hardware Enthusiast",
  generator: "Next.js",
  keywords: ["developer", "portfolio", "cyberpunk", "hardware", "programming", "1337"],
  authors: [{ name: "pix3l_p33p3r" }],
  creator: "pix3l_p33p3r",
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: "pix3l_p33p3r Portfolio",
    description: "Cyberpunk-themed portfolio showcasing projects in systems, hardware, and DevSecOps.",
    url: "https://pix3l-p33p3r.github.io/",
    siteName: "pix3l_p33p3r",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "pix3l_p33p3r Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "pix3l_p33p3r Portfolio",
    description: "Cyberpunk-themed portfolio showcasing projects in systems, hardware, and DevSecOps.",
    images: ["/placeholder-logo.png"],
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
        <Analytics />
      </body>
    </html>
  )
}
