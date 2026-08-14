type SkillStatus = "expert" | "active" | "learning"

const skillGroups: { title: string; items: { name: string; status: SkillStatus }[] }[] = [
  {
    title: "CONTAINER_CICD",
    items: [
      { name: "Docker", status: "expert" },
      { name: "Kubernetes (K3s/K3d)", status: "expert" },
      { name: "Helm", status: "active" },
      { name: "ArgoCD", status: "active" },
      { name: "GitOps", status: "active" },
      { name: "Jenkins", status: "active" },
      { name: "GitLab CI", status: "expert" },
      { name: "Terraform", status: "active" },
      { name: "Ansible", status: "active" },
      { name: "Nix", status: "active" },
      { name: "Bazel", status: "learning" },
    ],
  },
  {
    title: "SECURITY",
    items: [
      { name: "SonarQube", status: "active" },
      { name: "Trivy", status: "active" },
      { name: "OWASP ZAP", status: "active" },
      { name: "Pentesting", status: "active" },
      { name: "LLM Security", status: "active" },
      { name: "ASVS", status: "active" },
      { name: "STRIDE", status: "active" },
      { name: "IR", status: "active" },
      { name: "CVE", status: "active" },
    ],
  },
  {
    title: "INFRA_SECURITY",
    items: [
      { name: "Vault", status: "expert" },
      { name: "OpenSCAP", status: "expert" },
      { name: "ModSecurity", status: "active" },
      { name: "Suricata", status: "active" },
      { name: "Snort", status: "active" },
      { name: "ELK", status: "active" },
      { name: "Falco", status: "active" },
      { name: "OPA", status: "active" },
      { name: "SELinux/AppArmor", status: "active" },
      { name: "PKI/TLS", status: "expert" },
    ],
  },
  {
    title: "CLOUD_MONITORING",
    items: [
      { name: "AWS", status: "active" },
      { name: "Proxmox", status: "active" },
      { name: "Nginx", status: "expert" },
      { name: "Prometheus", status: "active" },
      { name: "Grafana", status: "active" },
      { name: "Datadog", status: "active" },
    ],
  },
  {
    title: "LANGUAGES",
    items: [
      { name: "C/C++", status: "expert" },
      { name: "Zig", status: "active" },
      { name: "Python", status: "expert" },
      { name: "Bash", status: "expert" },
      { name: "Git", status: "expert" },
      { name: "SQL/PostgreSQL", status: "active" },
    ],
  },
  {
    title: "EMBEDDED",
    items: [
      { name: "PLC", status: "active" },
      { name: "SCADA/HMI", status: "active" },
      { name: "KiCad", status: "active" },
      { name: "CAN", status: "active" },
      { name: "UART/I2C/SPI", status: "active" },
      { name: "BLE/Zigbee/LoRa/NFC", status: "learning" },
    ],
  },
]

function statusDotClass(status: SkillStatus): string {
  switch (status) {
    case "expert":
      return "bg-[#ff4800] shadow-[0_0_4px_#ff4800]"
    case "active":
      return "bg-[#00ffff] shadow-[0_0_4px_#00ffff]"
    case "learning":
      return "bg-[#ffff00] shadow-[0_0_4px_#ffff00]"
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export default function Skills() {
  return (
    <section id="skills" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-8 border-b border-[#ff4800] pb-2 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        SKILLS
      </h2>

      <div className="space-y-12">
        {skillGroups.map((group) => (
          <div key={group.title} className="space-y-5">
            <div className="flex items-center gap-3">
              <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">{group.title}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
              <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {group.items.map((skill) => (
                <div
                  key={skill.name}
                  className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-sm text-white tracking-wide">{skill.name}</div>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass(skill.status)}`}></div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">EXPERIENCE</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              "DevSecOps Intern · Cloud/Infra · Atlas Cloud Services · 6mo on-site — VMaaS zero-touch, Vault Agent + dynamic Postgres on K3s, PKI/TLS, OpenSCAP (PCI-DSS / ISO 27017), Vault Radar",
              "DevSecOps Intern · AI Security Automation · GSNA Solutions · 6mo hybrid — LLM pentest orchestrator (~73% less manual), NVD/CVE scoring, SAST/DAST gates (SonarQube, Trivy, ZAP)",
            ].map((item) => (
              <div
                key={item}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="font-mono text-sm text-white tracking-wide">{item}</div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">EDUCATION_CERTS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Network & Information Systems Architect · 1337 / UM6P · RNCP L7 · 2027",
              "Google Cybersecurity Certificate",
              "Google Cloud Professional Cloud DevOps Engineer",
              "Offensive: 20+ HTB/THM · Cloud: Global 42 AWS Cloud Quest",
            ].map((item) => (
              <div
                key={item}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="font-mono text-sm text-white tracking-wide">{item}</div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">LEADERSHIP</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "President · Leet-Makers Robotics Club · Nov 2022–present",
              "Technical member & CTF developer · Elitesec Club · May 2023–present",
            ].map((item) => (
              <div
                key={item}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="font-mono text-sm text-white tracking-wide">{item}</div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

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
            ].map((tool) => (
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

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">INTERESTS</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
            <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Robotics",
              "Philosophy",
              "Literature",
              "MMA",
              "ZK",
              "PQC",
              "OSINT",
              "Side-channels",
            ].map((interest) => (
              <div
                key={interest}
                className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00ffff]/30 group-hover:border-[#00ffff]/70 transition-colors duration-300"></div>
                <div className="font-mono text-sm text-white tracking-wide mb-1">{interest}</div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ff4800] to-[#00ffff] group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
