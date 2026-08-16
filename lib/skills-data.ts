export const skillGroups: { title: string; items: { name: string; level: number; blurb: string }[] }[] = [
  {
    title: "LANGUAGES",
    items: [
      { name: "C/C++", level: 90, blurb: "pointers, segfaults, and the smell of undefined behavior." },
      { name: "Zig", level: 70, blurb: "still dating. comptime is the love language." },
      { name: "Python", level: 88, blurb: "glue, exploits, and scripts that got too comfortable." },
      { name: "Bash", level: 86, blurb: "one-liners that should have been a file. they weren't." },
      { name: "SQL", level: 72, blurb: "joins I can explain. indexes I actually add." },
    ],
  },
  {
    title: "INFRA",
    items: [
      { name: "Linux", level: 92, blurb: "home. no GUI required. sometimes no friends either." },
      { name: "AWS", level: 68, blurb: "bills are a feature. IAM is the boss fight." },
      { name: "GCP", level: 64, blurb: "the other cloud. same rain, different console." },
      { name: "Nginx", level: 84, blurb: "reverse proxy priest. TLS 1.3 sermons." },
      { name: "Terraform", level: 74, blurb: "clickops is a crime scene. state file is the evidence." },
      { name: "Ansible", level: 76, blurb: "YAML that actually does something. rare." },
      { name: "Proxmox", level: 80, blurb: "homelab throne. VMs all the way down." },
      { name: "Nix", level: 66, blurb: "reproducible until the flake isn't. still worth it." },
      { name: "PostgreSQL", level: 70, blurb: "the database I actually trust." },
      { name: "Supabase", level: 62, blurb: "postgres with a seatbelt and a dashboard. not a language." },
    ],
  },
  {
    title: "DEVSECOPS",
    items: [
      { name: "Docker", level: 90, blurb: "it works on my container." },
      { name: "K3s/K3d", level: 86, blurb: "k8s without the ceremony. still enough YAML." },
      { name: "Helm", level: 72, blurb: "templates all the way down. values.yaml is destiny." },
      { name: "Argo CD", level: 74, blurb: "git said so. the cluster obeyed." },
      { name: "GitOps", level: 78, blurb: "if it isn't in git, it didn't happen." },
      { name: "GitLab CI", level: 84, blurb: "pipelines that yell before prod does." },
      { name: "Jenkins", level: 60, blurb: "legacy warlord. I keep it in a cage." },
      { name: "Vault", level: 88, blurb: "dynamic creds, rotating PKI, fewer sticky notes." },
      { name: "PKI/TLS", level: 86, blurb: "certs that expire on a Friday. I plan for that." },
      { name: "OpenSCAP", level: 80, blurb: "hardening with receipts." },
    ],
  },
  {
    title: "SECURITY",
    items: [
      { name: "SonarQube", level: 70, blurb: "the linter that bills by the smell." },
      { name: "Trivy", level: 78, blurb: "scan first. deploy second. argue never." },
      { name: "OWASP ZAP", level: 72, blurb: "I let the robot click the scary buttons." },
      { name: "Pentesting", level: 68, blurb: "authorized chaos. write it up after." },
      { name: "CVE Analysis", level: 74, blurb: "is this actually reachable, or just loud?" },
      { name: "Prometheus", level: 76, blurb: "metrics or it didn't happen." },
      { name: "Grafana", level: 76, blurb: "pretty graphs for ugly nights." },
      { name: "ELK", level: 72, blurb: "logs so I can prove I wasn't guessing." },
    ],
  },
  {
    title: "EMBEDDED",
    items: [
      { name: "PLC", level: 64, blurb: "factory floor logic. latency is physical." },
      { name: "SCADA/HMI", level: 62, blurb: "buttons that move real metal." },
      { name: "KiCad", level: 70, blurb: "schematics before solder. usually." },
      { name: "SBC", level: 78, blurb: "Pis, rocks, and whatever's in the drawer." },
      { name: "CAN Bus", level: 66, blurb: "cars talking. I listen." },
      { name: "UART/I2C/SPI", level: 80, blurb: "wires, clocks, and oscilloscope therapy." },
      { name: "BLE/Zigbee/LoRa", level: 58, blurb: "radio is a rumor until it isn't." },
    ],
  },
]

export { interests, interestChannels } from "@/lib/interests-data"
