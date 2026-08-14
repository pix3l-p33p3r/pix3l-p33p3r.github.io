export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  repoUrl: string
  ogImage?: string
}

export const projects: Project[] = [
  {
    slug: "ft-transcendence",
    title: "ft_transcendence",
    summary:
      "Multiplayer Django web app hardened with ModSecurity WAF, ELK SIEM, Vault, Prometheus/Grafana, and CI vuln scanning.",
    tags: ["Django", "ModSecurity", "ELK", "Vault", "DevSecOps"],
    repoUrl: "https://github.com/pix3l-p33p3r",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "cloud-1",
    title: "Cloud-1 / Inception",
    summary:
      "Secure LEMP in Docker: Nginx TLS 1.3 reverse proxy, MariaDB, PHP-FPM, Redis, FTP. Ansible orchestration on Cloud-1.",
    tags: ["Nginx", "Docker", "Ansible", "TLS 1.3", "MariaDB"],
    repoUrl: "https://github.com/pix3l-p33p3r/Cloud-1",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "born2beroot",
    title: "Born2beRoot",
    summary: "Debian hardening lab: certificate SSH, UFW, AppArmor, LVM, and cron. No GUI, no excuses.",
    tags: ["Linux", "UFW", "AppArmor", "LVM", "SSH"],
    repoUrl: "https://github.com/pix3l-p33p3r/Born2beRoot",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "inception-of-things",
    title: "Inception-of-Things",
    summary: "Kubernetes IoT lab on K3s/K3d: Ingress, Argo CD, GitLab GitOps. Cluster goes brrr, manifests stay in git.",
    tags: ["K3s", "K3d", "Argo CD", "GitOps", "Ingress"],
    repoUrl: "https://github.com/pix3l-p33p3r/Inception-of-Things-IoT-",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "homelab",
    title: "Homelab & Declarative Infra",
    summary: "Proxmox / TrueNAS homelab with NixOS declarative hosts and OpenBSD pf at the edge.",
    tags: ["Proxmox", "TrueNAS", "NixOS", "OpenBSD", "pf"],
    repoUrl: "https://github.com/pix3l-p33p3r",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "1337-systems",
    title: "1337 Systems Lab",
    summary:
      "School systems work: Computor-v1/v2 (C), ft_lex (Zig), ft_ping (C), Ready-Set-Boole (Rust), Libasm (NASM), Matrix (Rust).",
    tags: ["C", "Zig", "Rust", "NASM"],
    repoUrl: "https://github.com/pix3l-p33p3r/ft_lex",
    ogImage: "/placeholder.jpg",
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
