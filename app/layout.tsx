import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "pix3l_p33p3r Portfolio",
  description: "pix3l_p33p3r Portfolio ",
  generator: ".",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
