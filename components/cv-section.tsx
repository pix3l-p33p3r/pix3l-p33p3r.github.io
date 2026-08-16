"use client"

import { useState } from "react"
import CVDownload from "./cv-download"

const PREVIEW = [
  "$ file resume.pdf",
  "resume.pdf: PDF document, public, no comic sans",
  "$ strings resume.pdf | head",
  "pix3l_p33p3r  ·  DevSecOps  ·  1337/UM6P",
  "Vault · K3s · hardened clusters, not vibes",
  "STATUS=OPEN_TO_WORK",
]

export default function CVSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section id="resume" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center justify-between mb-4 border-b border-[#ff4800] pb-1.5">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)] m-0">RESUME</h2>
        <span className="font-mono text-[11px] text-[#00ffff]/70 tracking-widest">cat ./cv/*.pdf</span>
      </div>

      <div
        className="border border-[#333] bg-black/40 p-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex justify-between gap-3 text-[11px] font-mono text-white/40 tracking-wider mb-3">
          <span>pix3l_p33p3r_resume.pdf</span>
          <span className={hovered ? "text-[#00ffff]" : ""}>{hovered ? "READY" : "IDLE"}</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-xs mb-4">
          <dt className="text-[#ff4800]">type</dt>
          <dd className="m-0 text-[#9ef6f6]">application/pdf</dd>
          <dt className="text-[#ff4800]">access</dt>
          <dd className="m-0 text-[#9ef6f6]">public</dd>
          <dt className="text-[#ff4800]">hint</dt>
          <dd className="m-0 text-[#9ef6f6]">or type `resume` in the shell</dd>
        </dl>

        <pre className="m-0 mb-4 p-3 border border-dashed border-[#333] text-[11px] md:text-xs leading-relaxed text-[#00ffff]/80 overflow-x-auto">
          {PREVIEW.join("\n")}
        </pre>

        <div className="flex justify-center">
          <CVDownload />
        </div>
      </div>
    </section>
  )
}
