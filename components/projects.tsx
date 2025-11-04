"use client"
import Link from "next/link"
import { trackProjectView } from "@/lib/analytics"
import { projects } from "@/lib/projects"

export default function Projects() {
  const handleCardClick = (title: string) => {
    trackProjectView(title)
    console.log(`📊 Analytics: ${title} project view tracked`)
  }

  return (
    <section id="projects" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        PROJECTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        {projects.map((p) => (
          <article key={p.slug} className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300 flex flex-col">
            <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
            <h3 className="text-[#ff4800] text-2xl mb-2.5">{p.title}</h3>
            <div className="flex-1 flex flex-col">
              <p className="text-white text-xl mb-2.5">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-2.5 mt-auto">
                {p.tags.map((t) => (
                  <span key={t} className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2.5 mt-auto">
              <Link
                href={`/projects/${p.slug}`}
                onClick={() => handleCardClick(p.title)}
                className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
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
