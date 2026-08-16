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
        <span className="font-mono text-[11px] text-[#00ffff]/70 tracking-widest">spectrum · tune a band</span>
      </div>

      <div className="border border-[#333] bg-black/40 overflow-hidden">
        <div className="px-3 py-2 border-b border-[#333] flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.28em] text-white/35">RX · GUEST TUNER</span>
          <span className="font-mono text-[10px] text-[#00ffff]/80 tracking-widest">
            {channel ? `${channel.freq} ${channel.band}` : "—"}
          </span>
        </div>

        <div className="h-2 bg-[#0a0a0a] border-b border-[#222] relative overflow-hidden" aria-hidden="true">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#00ffff]/40 to-transparent animate-tuner-sweep" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4">
          {interestChannels.map((item) => {
            const active = item.id === tuned
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTuned(item.id)
                  trackInterestTune(item.callsign)
                }}
                className={`text-left px-3 py-3 border-b sm:border-b-0 sm:border-r border-[#222] last:border-r-0 transition-colors ${
                  active
                    ? "bg-[rgba(255,72,0,0.12)] text-[#ff4800]"
                    : "text-white/70 hover:bg-white/5 hover:text-[#00ffff]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm tracking-[0.2em]">{item.callsign}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#ff4800] shadow-[0_0_8px_#ff4800] animate-pulse" : "bg-white/20"}`}
                  />
                </div>
                <p className="m-0 mt-1 font-mono text-[10px] tracking-widest text-white/40">
                  {item.freq} {item.band}
                </p>
              </button>
            )
          })}
        </div>

        {channel ? (
          <div className="border-t border-[#333] p-4">
            <p className="m-0 font-mono text-[10px] tracking-[0.28em] text-[#00ffff]/70">
              CHANNEL {channel.callsign} · {channel.title.toUpperCase()}
            </p>
            <h3 className="m-0 mt-2 text-[#ff4800] text-xl tracking-wider">{channel.teaser}</h3>
            <ul className="mt-3 mb-0 pl-0 list-none space-y-2">
              {channel.log.map((line) => (
                <li key={line} className="font-mono text-sm text-[#9ef6f6] leading-relaxed">
                  <span className="text-[#ff4800] mr-2">›</span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {channel.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-widest border border-[#00ffff]/40 text-[#00ffff]/80 px-2 py-0.5"
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
