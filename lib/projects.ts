export type ProjectVisibility = "public" | "school"

export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  /** Public GitHub URL only. Omit for 42 / non-public work — never link a private repo. */
  repoUrl?: string
  visibility: ProjectVisibility
  ogImage?: string
}

const DEFAULT_OG = "/og/default.svg"

export const projects: Project[] = [
  {
    slug: "ft-transcendence",
    title: "ft_transcendence",
    summary:
      "42 finale: multiplayer stack hardened with ModSecurity, ELK, Vault, Prometheus/Grafana, and CI vuln scanning. Source stays off the public net.",
    tags: ["Django", "ModSecurity", "ELK", "Vault", "DevSecOps"],
    visibility: "school",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "inception",
    title: "Inception",
    summary:
      "42 Inception — containerized LEMP: NGINX (TLS), WordPress, MariaDB. Public sources. Later automated the same idea on Cloud-1 (not published).",
    tags: ["Docker", "Nginx", "MariaDB", "WordPress", "TLS"],
    repoUrl: "https://github.com/pix3l-p33p3r/Inception",
    visibility: "public",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "ft-irc",
    title: "ft_irc",
    summary: "IRC server in C++98: sockets, channels, the protocol as written, not as wished.",
    tags: ["C++98", "IRC", "sockets", "42"],
    repoUrl: "https://github.com/pix3l-p33p3r/ft_irc",
    visibility: "public",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "ft-lex",
    title: "ft_lex",
    summary: "POSIX-like lex utility in Zig. Compiler-adjacent, no hand-waving.",
    tags: ["Zig", "lex", "POSIX", "compiler"],
    repoUrl: "https://github.com/pix3l-p33p3r/ft_lex",
    visibility: "public",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "inception-of-things",
    title: "Inception-of-Things",
    summary: "42 Kubernetes intro: K3s/K3d, Ingress, Argo CD, Vagrant. Manifests in git. Repo is not public.",
    tags: ["K3s", "K3d", "Argo CD", "GitOps", "Vagrant"],
    visibility: "school",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "dotfiles",
    title: "dotfiles",
    summary: "NixOS + Home Manager, Hyprland, Catppuccin Mocha, SOPS/Age. The rice is reproducible. Mostly.",
    tags: ["NixOS", "Hyprland", "Home Manager", "SOPS"],
    repoUrl: "https://github.com/pix3l-p33p3r/dotfiles",
    visibility: "public",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "born2beroot",
    title: "Born2beRoot",
    summary: "Debian hardening: certificate SSH, UFW, AppArmor, LVM, cron. No GUI. 42 sysadmin rite of passage.",
    tags: ["Linux", "UFW", "AppArmor", "LVM", "SSH"],
    visibility: "school",
    ogImage: DEFAULT_OG,
  },
  {
    slug: "1337-systems",
    title: "1337 Systems",
    summary:
      "42 systems cluster: Computor-v1/v2 (C), ft_ping (ICMP), Ready-Set-Boole (Rust), Libasm (NASM), Matrix (Rust). Individual sources are not on the public net.",
    tags: ["C", "Rust", "NASM", "ICMP", "42"],
    visibility: "school",
    ogImage: DEFAULT_OG,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
