const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "LANGUAGES",
    items: ["C/C++", "Zig", "Python", "Bash", "SQL"],
  },
  {
    title: "INFRA",
    items: ["Linux", "AWS", "GCP", "Nginx", "Terraform", "Ansible", "Proxmox", "Nix", "PostgreSQL", "Supabase"],
  },
  {
    title: "DEVSECOPS",
    items: ["Docker", "K3s/K3d", "Helm", "Argo CD", "GitOps", "GitLab CI", "Jenkins", "Vault", "PKI/TLS", "OpenSCAP"],
  },
  {
    title: "SECURITY",
    items: ["SonarQube", "Trivy", "OWASP ZAP", "Pentesting", "CVE Analysis", "Prometheus", "Grafana", "ELK"],
  },
  {
    title: "EMBEDDED",
    items: ["PLC", "SCADA/HMI", "KiCad", "SBC", "CAN Bus", "UART/I2C/SPI", "BLE/Zigbee/LoRa"],
  },
]

const interests = ["ZK", "PQC", "OSINT", "Side-channels"]

export default function Skills() {
  return (
    <section id="skills" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-5 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        SKILLS
      </h2>

      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[#00ffff] text-sm tracking-[0.18em] font-mono mb-2.5">{group.title}</h3>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="font-mono text-sm text-white/90 border border-[#333] bg-black/25 px-2.5 py-1 tracking-wide hover:border-[#00ffff]/60 hover:text-[#00ffff] transition-colors duration-200"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-[#00ffff] text-sm tracking-[0.18em] font-mono mb-2.5">INTERESTS</h3>
          <p className="font-mono text-sm text-white/70 tracking-wide m-0">{interests.join(" · ")}</p>
        </div>
      </div>
    </section>
  )
}
