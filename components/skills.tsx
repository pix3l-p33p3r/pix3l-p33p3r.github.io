import type { ReactNode } from "react"

type SkillStatus = "expert" | "active" | "learning"

const skillGroups: { title: string; items: { name: string; status: SkillStatus }[] }[] = [
  {
    title: "INFRA_CLOUD",
    items: [
      { name: "AWS", status: "active" },
      { name: "GCP", status: "active" },
      { name: "Terraform", status: "active" },
      { name: "Ansible", status: "active" },
      { name: "Linux Admin", status: "expert" },
      { name: "Nginx", status: "expert" },
      { name: "Proxmox", status: "active" },
      { name: "Nix", status: "active" },
    ],
  },
  {
    title: "DEVSECOPS_CONTAINERS",
    items: [
      { name: "Docker", status: "expert" },
      { name: "Kubernetes (K3s/K3d)", status: "expert" },
      { name: "Helm", status: "active" },
      { name: "ArgoCD", status: "active" },
      { name: "GitOps", status: "active" },
      { name: "Jenkins", status: "active" },
      { name: "GitLab CI", status: "expert" },
      { name: "Vault", status: "expert" },
      { name: "OpenSCAP", status: "expert" },
      { name: "PKI/TLS", status: "expert" },
    ],
  },
  {
    title: "SECURITY_MONITORING",
    items: [
      { name: "SonarQube", status: "active" },
      { name: "Trivy", status: "active" },
      { name: "OWASP ZAP", status: "active" },
      { name: "Pentesting", status: "active" },
      { name: "CVE Analysis", status: "active" },
      { name: "Prometheus", status: "active" },
      { name: "Grafana", status: "active" },
      { name: "ELK", status: "active" },
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
      { name: "Supabase", status: "active" },
    ],
  },
  {
    title: "EMBEDDED",
    items: [
      { name: "PLC", status: "active" },
      { name: "SCADA/HMI", status: "active" },
      { name: "KiCad", status: "active" },
      { name: "SBC", status: "active" },
      { name: "CAN Bus", status: "active" },
      { name: "UART/I2C/SPI", status: "active" },
      { name: "BLE/Zigbee/LoRa", status: "learning" },
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

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="group relative bg-black/30 border border-[#333] p-5 transition-all duration-300 hover:border-[#00ffff]/50 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00ffff]/0 via-[#00ffff]/50 to-[#00ffff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {children}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ffff] group-hover:w-full transition-all duration-500"></div>
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-[#00ffff] text-lg tracking-[0.2em] font-mono uppercase">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-[#00ffff]/30 to-transparent"></div>
      <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
    </div>
  )
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
            <SectionHeading title={group.title} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {group.items.map((skill) => (
                <Card key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-sm text-white tracking-wide">{skill.name}</div>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass(skill.status)}`}></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-5">
          <SectionHeading title="LANGUAGES_CERTS" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "English (Fluent) · French (Professional) · Arabic (Native)",
              "Google Cybersecurity Certificate",
              "Google Cloud Professional Cloud DevOps Engineer",
              "Offensive: 20+ HTB/THM · Cloud: Global 42 AWS Cloud Quest",
            ].map((item) => (
              <Card key={item}>
                <div className="font-mono text-sm text-white tracking-wide">{item}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeading title="LEADERSHIP" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "President · Leet-Makers Robotics Club · Nov 2022–present",
              "Technical member & CTF developer · Elitesec Club · May 2023–present",
            ].map((item) => (
              <Card key={item}>
                <div className="font-mono text-sm text-white tracking-wide">{item}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeading title="INTERESTS" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["ZK", "PQC", "OSINT", "Side-channels"].map((interest) => (
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
