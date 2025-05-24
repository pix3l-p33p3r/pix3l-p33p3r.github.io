import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "pix3l_p33p3r Portfolio",
  description: "pix3l_p33p3r Portfolio - showcase of projects, skills, and experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden relative leading-relaxed">
        {/* CRT Scanline Effect */}
        <div className="fixed inset-0 bg-scanline pointer-events-none z-50 animate-scanline"></div>
        {/* CRT Flicker Effect */}
        <div className="fixed inset-0 bg-transparent pointer-events-none z-[60] animate-flicker"></div>
        {children}
      </body>
    </html>
  )
}
