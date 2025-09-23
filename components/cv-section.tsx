"use client"

import CVDownload from "./cv-download"

export default function CVSection() {
  return (
    <section id="resume" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">RESUME</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#ff4800]/30 to-transparent"></div>
        <div className="w-2 h-2 bg-[#ff4800] rounded-full animate-pulse"></div>
      </div>

      <div className="bg-black/30 border border-[#333] p-6">
        <div className="flex justify-center">
          <CVDownload />
        </div>
      </div>
    </section>
  )
}
