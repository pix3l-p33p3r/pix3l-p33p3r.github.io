"use client"
import { trackProjectView } from "@/lib/analytics"

export default function Projects() {
  const handleProjectClick = (projectName: string, url: string) => {
    trackProjectView(projectName)
    console.log(`📊 Analytics: ${projectName} project view tracked`)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="projects" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        PROJECTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        <article className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300">
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
          <h3 className="text-[#ff4800] text-2xl mb-2.5">virtualization</h3>

          <div className="project-icon">
            <i className="fas fa-cube"></i>
          </div>

          <p className="text-white text-xl mb-2.5 flex-grow">
            Containerization and VM management tools with focus on performance optimization and security hardening.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Docker
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              KVM
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Linux
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Shell
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => handleProjectClick("Virtualization", "https://github.com/pix3l-p33p3r?tab=repositories")}
              className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
            >
              View Project
            </button>
          </div>
        </article>

        <article className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300">
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
          <h3 className="text-[#ff4800] text-2xl mb-2.5">Hardware</h3>
          <p className="text-white text-xl mb-2.5">Custom hardware projects and firmware</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Arduino
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              ESP32
            </span>
          </div>
          <button
            onClick={() => handleProjectClick("Hardware", "https://github.com/pix3l-p33p3r?tab=repositories")}
            className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
          >
            View Project
          </button>
        </article>

        <article className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300">
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
          <h3 className="text-[#ff4800] text-2xl mb-2.5">Low-Level/OOP</h3>
          <p className="text-white text-xl mb-2.5">Systems programming and object-oriented design</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              C/C++
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Assembly
            </span>
          </div>
          <button
            onClick={() => handleProjectClick("Low-Level/OOP", "https://github.com/pix3l-p33p3r?tab=repositories")}
            className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
          >
            View Project
          </button>
        </article>

        <article className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300">
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
          <h3 className="text-[#ff4800] text-2xl mb-2.5">Graphics in C</h3>
          <p className="text-white text-xl mb-2.5">Low-level graphics programming</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              C
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              RayTracing
            </span>
          </div>
          <button
            onClick={() => handleProjectClick("Graphics in C", "https://github.com/pix3l-p33p3r?tab=repositories")}
            className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
          >
            View Project
          </button>
        </article>

        <article className="project-card bg-gradient-to-br from-black/60 to-black/80 border border-[#333] p-5 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#00ffff] before:opacity-70 transition-all duration-300">
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#00ffff] animate-pulse"></div>
          <h3 className="text-[#ff4800] text-2xl mb-2.5">DevSecOps Pipeline</h3>
          <p className="text-white text-xl mb-2.5">Secure CI/CD implementation</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              Jenkins
            </span>
            <span className="bg-[rgba(0,255,255,0.1)] border border-[#00ffff] py-1.5 px-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:bg-[rgba(0,255,255,0.2)] hover:-translate-y-0.5">
              GitLab CI
            </span>
          </div>
          <button
            onClick={() => handleProjectClick("DevSecOps Pipeline", "https://github.com/pix3l-p33p3r?tab=repositories")}
            className="text-[#00ffff] text-lg no-underline inline-block mt-auto py-1.5 border-t border-dashed border-[#333] w-full text-center transition-colors duration-200 hover:bg-[rgba(0,255,255,0.1)]"
          >
            View Project
          </button>
        </article>
      </div>
    </section>
  )
}
