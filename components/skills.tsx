"use client"

import { useState } from "react"
import { skillGroups } from "@/lib/skills-data"
import { trackSkillInspect } from "@/lib/analytics"

type SelectedSkill = {
  group: string
  name: string
  blurb: string
}

export default function Skills() {
  const firstGroup = skillGroups[0]
  const first = firstGroup?.items[0]
  const [selected, setSelected] = useState<SelectedSkill | null>(
    first && firstGroup ? { group: firstGroup.title, name: first.name, blurb: first.blurb } : null,
  )

  return (
    <section id="skills" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center justify-between mb-4 border-b border-[#ff4800] pb-1.5">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)] m-0">SKILLS</h2>
        <span className="font-mono text-xs text-[#00ffff] tracking-widest">inspect</span>
      </div>

      <div className="border border-[#333] bg-black">
        {skillGroups.map((group) => (
          <div key={group.title} className="border-b border-[#333] last:border-b-0 px-3 py-3">
            <h3 className="m-0 mb-2 font-mono text-sm tracking-[0.18em] text-[#00ffff]">{group.title}</h3>
            <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
              {group.items.map((skill) => {
                const active = selected?.name === skill.name && selected.group === group.title
                return (
                  <li key={skill.name}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setSelected({ group: group.title, name: skill.name, blurb: skill.blurb })
                        trackSkillInspect(skill.name, group.title)
                      }}
                      className={`min-h-11 px-3 font-mono text-sm tracking-wide border transition-colors ${
                        active
                          ? "border-[#ff4800] bg-[rgba(255,72,0,0.12)] text-[#ff4800] shadow-[inset_3px_0_0_#ff4800]"
                          : "border-[#333] text-white hover:border-[#00ffff] hover:text-[#00ffff]"
                      }`}
                    >
                      {skill.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div className="px-3 py-3 min-h-[4.5rem]" aria-live="polite">
          {selected ? (
            <>
              <p className="m-0 font-mono text-xs text-[#ff4800] tracking-wider">
                {selected.group} · {selected.name}
              </p>
              <p className="m-0 mt-1 font-mono text-sm text-[#9ef6f6]">{selected.blurb}</p>
            </>
          ) : (
            <p className="m-0 font-mono text-sm text-[#ccc]">select a skill</p>
          )}
        </div>
      </div>
    </section>
  )
}
