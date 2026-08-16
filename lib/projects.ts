export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  /** Public GitHub URL when one exists; omit for private / non-repo work. */
  repoUrl?: string
  ogImage?: string
}

const DEFAULT_OG = "/og/default.svg"

export const projects: Project[] = [
  {
    slug: "ft-transcendence",
    title: "ft_transcendence",
    summary:
      "Multiplayer Django app hardened with ModSecurity WAF, ELK SIEM, Vault, Prometheus/Grafana, and CI vuln scanning.",
    tags: ["Django", "ModSecurity", "ELK", "Vault", "DevSecOps"],
    ogImage: DEFAULT_OG,
  },
  {
    slug: "cloud-1",
    title: "Cloud-1 / Inception",
    summary:
      "Nginx TLS 1.3 reverse proxy, MariaDB, PHP-FPM, Redis, FTP. Ansible orchestration on Cloud-1.",
    tags: ["Nginx", "Docker", "Ansible", "TLS 1.3", "MariaDB"],
    repoUrl: "https://github.com/pix3l-p33p3r/Inception",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "born2beroot",
    title: "Born2beRoot",
    summary: "Debian hardening: certificate SSH, UFW, AppArmor, LVM, and cron. No GUI.",
    tags: ["Linux", "UFW", "AppArmor", "LVM", "SSH"],
    repoUrl: "https://github.com/pix3l-p33p3r/Born2beRoot",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "inception-of-things",
    title: "Inception-of-Things",
    summary: "K3s/K3d lab with Ingress, Argo CD, and GitLab GitOps. Manifests stay in git.",
    tags: ["K3s", "K3d", "Argo CD", "GitOps", "Ingress"],
    ogImage: DEFAULT_OG,
  },
  {
    slug: "homelab",
    title: "Homelab",
    summary: "Proxmox/TrueNAS private cloud, NixOS hosts, OpenBSD pf at the edge, Pi-hole, Syncthing.",
    tags: ["Proxmox", "TrueNAS", "NixOS", "OpenBSD", "pf"],
    ogImage: DEFAULT_OG,
  },
  {
    slug: "1337-systems",
    title: "1337 Systems",
    summary:
      "Computor-v1/v2 (C), ft_lex (Zig), ft_ping (C), Ready-Set-Boole (Rust), Libasm (NASM), Matrix (Rust).",
    tags: ["C", "Zig", "Rust", "NASM"],
    repoUrl: "https://github.com/pix3l-p33p3r/ft_lex",
    ogImage: DEFAULT_OG,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
