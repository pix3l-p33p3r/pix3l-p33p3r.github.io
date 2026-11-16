"use client"

import { Download, FileText } from "lucide-react"
import { trackResumeDownload } from "@/lib/analytics"

export default function CVDownload() {
  return (
    <a
      href="/cv/pix3l_p33p3r_resume.pdf"
      download="Pixel_Peeper_Resume.pdf"
      onClick={() => trackResumeDownload()}
      className="group relative inline-flex bg-black/40 border border-[#333] px-5 py-3 min-h-11 transition-colors duration-150 hover:border-[#00ffff] hover:bg-black/60 active:border-[#ff4800]"
    >
      <div className="flex items-center gap-2">
        <Download size={18} strokeWidth={1.5} className="text-[#00ffff]" aria-hidden="true" />
        <div className="flex flex-col items-start">
          <span className="font-mono text-sm text-white tracking-wide">DOWNLOAD_RESUME</span>
          <span className="font-mono text-xs text-[#c8c8c8] tracking-wider">PDF_FORMAT</span>
        </div>
        <FileText size={18} strokeWidth={1.5} className="text-[#ff4800] opacity-60" aria-hidden="true" />
      </div>
    </a>
  )
}
