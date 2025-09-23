"use client"

import { useState } from "react"
import { Download, FileText, Check } from "lucide-react"
import { trackResumeDownload } from "@/lib/analytics"

export default function CVDownload() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Simulate download process for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create a link element and trigger download
      const link = document.createElement("a")
      // Correct path: public/cv/pix3l_p33p3r_resume.pdf -> /cv/pix3l_p33p3r_resume.pdf
      link.href = "/cv/pix3l_p33p3r_resume.pdf"
      link.download = "Pixel_Peeper_Resume.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Track the download event
      trackResumeDownload()

      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3000)

      console.log("📊 Analytics: Resume download tracked")
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="group relative bg-black/40 border border-[#333] px-6 py-3 transition-all duration-300 hover:border-[#00ffff] hover:bg-black/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Animated border effect */}
      <div className="absolute inset-0 border border-[#00ffff] opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>

      <div className="flex items-center gap-3">
        <div className="relative">
          {isDownloaded ? (
            <Check size={18} className="text-[#00ff00]" />
          ) : isDownloading ? (
            <div className="w-4 h-4 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Download size={18} className="text-[#00ffff] group-hover:text-white transition-colors duration-200" />
          )}
        </div>

        <div className="flex flex-col items-start">
          <span className="font-mono text-sm text-white tracking-wide">
            {isDownloaded ? "DOWNLOADED" : isDownloading ? "DOWNLOADING..." : "DOWNLOAD_RESUME"}
          </span>
          <span className="font-mono text-xs text-[#aaa] tracking-wider">
            {isDownloaded ? "SUCCESS" : "PDF_FORMAT"}
          </span>
        </div>

        <FileText size={16} className="text-[#ff4800] opacity-60" />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff4800] group-hover:w-full transition-all duration-700"></div>
    </button>
  )
}
