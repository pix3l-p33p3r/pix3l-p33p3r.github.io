"use client"

import { useState } from "react"
import { skillGroups } from "@/lib/skills-data"
import { trackSkillInspect } from "@/lib/analytics"

function bar(level: number): string {
  const filled = Math.round(level / 10)
  return `${"█".repeat(filled)}${"░".repeat(10 - filled)}`
}

export default function Skills() {
  const first = skillGroups[0]?.items[0]
  const [selected, setSelected] = useState<{ group: string; name: string; blurb: string; level: number } | null>(
    first
      ? {
          group: skillGroups[0].title,
          name: first.name,
          blurb: first.blurb,
          level: first.level,
        }
      : null,
  )

  return (
    <section id="skills" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center justify-between mb-4 border-b border-[#ff4800] pb-1.5">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)] m-0">SKILLS</h2>
        <span className="font-mono text-[11px] text-[#00ffff]/70 tracking-widest">rack · click a module</span>
      </div>

      <div className="border border-[#333] bg-black/40">
        <div className="flex justify-between px-3 py-1.5 text-[10px] tracking-[0.2em] text-white/35 border-b border-[#333]">
          <span>BAY / MODULE</span>
          <span>SIGNAL</span>
        </div>

        <div className="max-h-[20rem] overflow-y-auto no-scrollbar">
          {skillGroups.map((group, bay) => (
            <div key={group.title} className="border-b border-[#222] last:border-b-0">
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-[#00ffff] text-[11px] tracking-[0.22em]">
                  U{bay + 1} {group.title}
                </span>
                <span className="text-[10px] text-white/25 tracking-widest">{group.items.length} MOD</span>
              </div>
              <ul className="list-none m-0 p-0">
                {group.items.map((skill) => {
                  const active = selected?.name === skill.name && selected.group === group.title
                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected({ group: group.title, name: skill.name, blurb: skill.blurb, level: skill.level })
                          trackSkillInspect(skill.name, group.title)
                        }}
                        className={`w-full text-left px-3 py-1.5 font-mono text-sm flex items-center gap-3 transition-colors ${
                          active
                            ? "bg-[rgba(0,255,255,0.12)] text-[#00ffff]"
                            : "text-white/85 hover:bg-white/5 hover:text-[#00ffff]"
                        }`}
                      >
                        <span className="text-[#ff4800] w-[7.5rem] shrink-0 truncate">{skill.name}</span>
                        <span className="text-[11px] tracking-widest text-white/50 hidden sm:inline">
                          {bar(skill.level)}
                        </span>
                        <span className="ml-auto text-[11px] text-[#aaa] tabular-nums">{skill.level}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#333] px-3 py-3 min-h-[5.5rem]">
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="m-0 font-mono text-xs text-[#ff4800] tracking-wider">
                  {selected.group}/{selected.name}
                </p>
                <p className="m-0 font-mono text-[10px] text-[#00ffff]/70 tracking-widest">{selected.level}% LOCK</p>
              </div>
              <div className="mt-2 h-1.5 bg-[#111] border border-[#222] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff4800] to-[#00ffff] transition-[width] duration-500"
                  style={{ width: `${selected.level}%` }}
                />
              </div>
              <p className="m-0 mt-2 font-mono text-sm text-[#9ef6f6]">{selected.blurb}</p>
            </>
          ) : (
            <p className="m-0 font-mono text-sm text-white/40">select a module</p>
          )}
        </div>
      </div>
    </section>
  )
}
