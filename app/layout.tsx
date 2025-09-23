import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"
import Script from "next/script"
import { GA_TRACKING_ID } from "@/lib/analytics"

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${shareTechMono.className} bg-black text-white overflow-hidden relative leading-relaxed`}>
        {/* CRT Scanline Effect */}
        <div className="fixed inset-0 bg-scanline pointer-events-none z-50 animate-scanline"></div>
        {/* CRT Flicker Effect */}
        <div className="fixed inset-0 bg-transparent pointer-events-none z-[60] animate-flicker"></div>
        {children}
      </body>
    </html>
  )
}
