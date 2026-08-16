"use client"

import Link from "next/link"
import { trackProjectView } from "@/lib/analytics"
import { projects } from "@/lib/projects"

export default function Projects() {
  return (
    <section id="projects" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <div className="flex items-center justify-between mb-4 border-b border-[#ff4800] pb-1.5">
        <h2 className="text-[#ff4800] text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)] m-0">PROJECTS</h2>
        <span className="font-mono text-[11px] text-[#00ffff]/70 tracking-widest">public clones · 42 work</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300 flex flex-col hover:border-[#00ffff]/40"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className={`font-mono text-[10px] tracking-widest px-1.5 py-0.5 border ${
                  p.visibility === "public"
                    ? "border-[#00ffff]/50 text-[#00ffff]"
                    : "border-[#ff4800]/50 text-[#ff4800]"
                }`}
              >
                {p.visibility === "public" ? "PUBLIC" : "42"}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse" />
            </div>
            <h3 className="text-[#ff4800] text-2xl mb-2.5 pr-24">{p.title}</h3>
            <div className="flex-1 flex flex-col">
              <p className="text-white text-lg mb-2.5">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-2.5 mt-auto">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1 px-2.5 text-xs tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <Link
                href={`/projects/${p.slug}`}
                onClick={() => trackProjectView(p.title)}
                className="text-[#00ffff] text-lg no-underline inline-block py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
              >
                View Project
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
