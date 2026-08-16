"use client"

import { useState } from "react"
import { interestChannels } from "@/lib/interests-data"
import { trackInterestTune } from "@/lib/analytics"

export default function Interests() {
  const [tuned, setTuned] = useState(interestChannels[0]?.id ?? "zk")
  const channel = interestChannels.find((item) => item.id === tuned) ?? interestChannels[0]

  return (
    <section id="interests" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center justify-between mb-4 border-b border-[#ff4800] pb-1.5">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)] m-0">
          INTERESTS
        </h2>
        <span className="font-mono text-xs text-[#00ffff] tracking-widest">topics</span>
      </div>

      <div className="border border-[#333] bg-black overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#333]">
          {interestChannels.map((item) => {
            const active = item.id === tuned
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setTuned(item.id)
                  trackInterestTune(item.callsign)
                }}
                className={`min-h-11 px-3 font-mono text-sm tracking-[0.16em] transition-colors ${
                  active
                    ? "bg-[rgba(255,72,0,0.12)] text-[#ff4800] shadow-[inset_0_-2px_0_#ff4800]"
                    : "bg-black text-white hover:text-[#00ffff]"
                }`}
              >
                {item.callsign}
              </button>
            )
          })}
        </div>

        {channel ? (
          <div className="p-4">
            <p className="m-0 font-mono text-xs tracking-[0.18em] text-[#00ffff]">{channel.title}</p>
            <h3 className="m-0 mt-2 text-[#ff4800] text-xl tracking-wider">{channel.teaser}</h3>
            <ul className="mt-3 mb-0 pl-0 list-none space-y-2">
              {channel.log.map((line) => (
                <li key={line} className="font-mono text-sm text-[#9ef6f6] leading-relaxed">
                  <span className="text-[#ff4800] mr-2" aria-hidden="true">
                    ›
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {channel.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs tracking-widest border border-[#00ffff] text-[#00ffff] px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
