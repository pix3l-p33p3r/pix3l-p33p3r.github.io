export default function Skills() {
  return (
    <section id="skills" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-8 border-b border-[#ff4800] pb-2 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        SKILLS
      </h2>

      <div className="space-y-12">
        {/* 1337 Curriculum */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">1337_CURRICULUM</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Bash", status: "active" },
              { name: "C/C++", status: "expert" },
              { name: "Networking", status: "active" },
              { name: "Unix/BSD", status: "active" },
              { name: "Virtualization", status: "learning" },
              { name: "CI/CD", status: "expert" },
            ].map((skill, index) => (
              <div
                key={skill.name}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm text-white tracking-wide">{skill.name}</div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      skill.status === "expert"
                        ? "bg-[#ff4800] shadow-[0_0_4px_#ff4800]"
                        : skill.status === "active"
                          ? "bg-[#00ffff] shadow-[0_0_4px_#00ffff]"
                          : "bg-[#ffff00] shadow-[0_0_4px_#ffff00]"
                    }`}
                  ></div>
                </div>

                

                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">LANGUAGES</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Python", status: "active", proficiency: "Intermediate" },
              { name: "Lua", status: "learning", proficiency: "Beginner" },
            ].map((skill, index) => (
              <div
                key={skill.name}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm text-white tracking-wide">{skill.name}</div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      skill.status === "active"
                        ? "bg-[#00ffff] shadow-[0_0_4px_#00ffff]"
                        : "bg-[#ffff00] shadow-[0_0_4px_#ffff00]"
                    }`}
                  ></div>
                </div>

                

                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Tools */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">DEVELOPMENT_TOOLS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: "Neovim", daily: true },
              { name: "Cursor", daily: false },
              { name: "Obsidian", daily: false },
              { name: "Markdown", daily: true },
              { name: "LaTeX", daily: false },
            ].map((tool, index) => (
              <div
                key={tool.name}
                className="group relative bg-black/30 border border-[#333] p-4 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:scale-105"
              >
                <div className="absolute top-1 right-1">
                  <div
                    className={`w-1 h-1 rounded-full ${tool.daily ? "bg-[#00ff00] animate-pulse" : "bg-[#666]"}`}
                  ></div>
                </div>

                <div className="text-center">
                  <div className="font-mono text-xs text-white tracking-wide mb-1">{tool.name}</div>
                  
                </div>

                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#00ffff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">INTERESTS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Robotics", field: "Hardware" },
              { name: "Philosophy", field: "Theory" },
              { name: "Literature", field: "Arts" },
              { name: "MMA", field: "Sports" },
            ].map((interest, index) => (
              <div
                key={interest.name}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00ffff]/30 group-hover:border-[#00ffff]/70 transition-colors duration-300"></div>

                <div className="font-mono text-sm text-white tracking-wide mb-1">{interest.name}</div>
                

                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff4800] to-[#00ffff] group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
