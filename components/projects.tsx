"use client"
import Link from "next/link"
import { trackProjectView } from "@/lib/analytics"
import { projects } from "@/lib/projects"

export default function Projects({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const Title = heading
  return (
    <section id="projects" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <Title className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        PROJECTS
      </Title>
      <div className="project-grid grid grid-cols-1 gap-5 mt-5">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] relative overflow-hidden transition-colors duration-150 flex flex-col"
          >
            <div className="status-dot" aria-hidden="true"></div>
            <h3 className="text-[#ff4800] text-2xl mb-3">{p.title}</h3>
            <div className="flex-1 flex flex-col">
              <p className="text-white text-xl mb-3">{p.summary}</p>
              <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="chip bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1 px-3 rounded text-sm tracking-wider transition-colors duration-150 hover:bg-[rgba(0,255,255,0.2)]"
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
                className="text-[#00ffff] text-lg no-underline inline-flex items-center justify-center min-h-11 mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
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
