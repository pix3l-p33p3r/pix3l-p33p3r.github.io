import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SITE_URL } from "@/lib/site"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "pix3l_p33p3r Portfolio",
  description:
    "El Houcine El Yakoubi (@PiX3L_P33P3R) — DevSecOps & Infrastructure Security Architect. Vault, Kubernetes, AI-driven pentesting. 1337 / UM6P.",
  generator: "Next.js",
  keywords: [
    "DevSecOps",
    "infrastructure security",
    "Vault",
    "Kubernetes",
    "portfolio",
    "cyberpunk",
    "1337",
    "pix3l_p33p3r",
  ],
  authors: [{ name: "El Houcine El Yakoubi", url: SITE_URL }],
  creator: "pix3l_p33p3r",
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: "pix3l_p33p3r Portfolio",
    description: "DevSecOps & Infrastructure Security Architect. Vault on K3s, dynamic creds, PCI-DSS / ISO 27017.",
    url: SITE_URL,
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
    description: "DevSecOps & Infrastructure Security Architect. Vault on K3s, dynamic creds, PCI-DSS / ISO 27017.",
    creator: "@PiX3L_P33P3R",
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
