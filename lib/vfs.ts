import { interestChannels } from "@/lib/interests-data"
import { BIO, HANDLE, HOSTNAME, MOTTO, PHILOSOPHY, SCHOOL, STATUS } from "@/lib/persona"
import { projects } from "@/lib/projects"
import { skillGroups } from "@/lib/skills-data"

export type VFile = {
  kind: "file"
  content: string
  executable?: boolean
}

export type VDir = {
  kind: "dir"
  children: Record<string, VNode>
}

export type VNode = VFile | VDir

export const GUEST_HOME = "/home/guest"
export const ROOT_HOME = "/root"
export const DEFAULT_PATH = "/bin:/usr/bin"

export const BINARIES = [
  "ls",
  "cat",
  "pwd",
  "cd",
  "echo",
  "printf",
  "whoami",
  "id",
  "uname",
  "hostname",
  "date",
  "env",
  "printenv",
  "export",
  "help",
  "man",
  "clear",
  "which",
  "type",
  "true",
  "false",
  "head",
  "tail",
  "wc",
  "grep",
  "tree",
  "file",
  "stat",
  "history",
  "neofetch",
  "fastfetch",
  "fortune",
  "cowsay",
  "sl",
  "matrix",
  "ping",
  "vsh",
] as const

export const TRAP_BINARIES = ["sudo", "vim", "vi", "emacs", "rm", "ssh", "hack", "curl", "wget", "nc", "nmap"] as const

function file(content: string, executable = false): VFile {
  return { kind: "file", content, executable }
}

function dir(children: Record<string, VNode>): VDir {
  return { kind: "dir", children }
}

function execPlaceholder(): VFile {
  return file("vsh builtin\n", true)
}

function binDir(names: readonly string[]): VDir {
  return dir(Object.fromEntries(names.map((name) => [name, execPlaceholder()])))
}

function projectListing(): string {
  return projects
    .map((project) => {
      const vis = project.visibility === "public" ? "public" : "42"
      const repo = project.repoUrl ?? "(no public clone)"
      return `${project.slug}\n  ${project.title}  [${vis}]\n  ${project.summary}\n  ${project.tags.join(" · ")}\n  ${repo}\n`
    })
    .join("\n")
}

function skillsListing(): string {
  return skillGroups
    .map((group) => `${group.title}\n  ${group.items.map((item) => `${item.name} (${item.level})`).join("\n  ")}`)
    .join("\n\n")
}

function interestsListing(): string {
  return interestChannels
    .map((ch) => `${ch.callsign}  ${ch.freq} ${ch.band}\n  ${ch.title} — ${ch.teaser}\n  ${ch.log.join(" ")}`)
    .join("\n\n")
}

export function createGuestFs(): VDir {
  const projectFiles = Object.fromEntries(
    projects.map((project) => [
      `${project.slug}.txt`,
      file(`${project.title}\n${project.summary}\n${project.tags.join(" · ")}\n${project.repoUrl ?? "(no public clone)"}\n`),
    ]),
  )

  const manPages = Object.fromEntries(
    [...BINARIES, "vsh"].map((name) => [
      `${name}.1`,
      file(`${name.toUpperCase()}(1)\nvirtual guest manual — type: man ${name}\n`),
    ]),
  )

  return dir({
    bin: binDir(BINARIES),
    usr: dir({
      bin: binDir(["env", "printenv", "man", "which", "head", "tail", "wc", "grep"]),
      share: dir({
        man: dir({
          man1: dir(manPages),
        }),
      }),
    }),
    etc: dir({
      hostname: file(`${HOSTNAME}\n`),
      issue: file(`CRT-Linux 14.2 (scanline) — guest tty\n`),
      motd: file(`welcome to vsh. air-gapped guest. type help. press \` to refocus.\n${MOTTO}\n`),
      "os-release": file(`NAME="CRT-Linux"\nVERSION="14.2 (scanline)"\nID=crt\nPRETTY_NAME="CRT-Linux 14.2"\n`),
      passwd: file(`root:x:0:0:root:${ROOT_HOME}:/bin/vsh\nguest:x:1000:1000:pixel peeper:${GUEST_HOME}:/bin/vsh\n`),
      profile: file(`export PATH=${DEFAULT_PATH}\nexport SHELL=/bin/vsh\n`),
    }),
    home: dir({
      guest: dir({
        "motto.txt": file(`${MOTTO}\n`),
        "bio.txt": file(`${BIO}\n`),
        "philosophy.txt": file(`${PHILOSOPHY}\n`),
        "skills.txt": file(`${skillsListing()}\n`),
        "interests.txt": file(`${interestsListing()}\n`),
        "status.txt": file(`${STATUS}\n`),
        "resume.txt": file("pix3l_p33p3r  ·  DevSecOps  ·  1337/UM6P\nVault · K3s · hardened clusters, not vibes\nSTATUS=OPEN_TO_WORK\ntype `resume` to download the PDF\n"),
        "about.txt": file(`${HANDLE} — ${SCHOOL}\nNixOS cultist. Hyprland daily driver. CLI/TUI native.\n`),
        projects: dir(projectFiles),
      }),
    }),
    root: dir({
      "README.txt": file("you used the Konami code. this is still a guest kernel.\ntry `secret`.\n"),
    }),
    proc: dir({
      version: file(`vsh 0.5 (${HOSTNAME}) #1 SMP peeper\n`),
      cmdline: file("/bin/vsh --guest --air-gap\n"),
      cpuinfo: file("processor\t: 0\nmodel name\t: CRT-CORE 1337\nflags\t\t: scanline neon peep\n"),
    }),
    tmp: dir({}),
    var: dir({
      log: dir({
        "boot.log": file(
          [
            "[  0.000] vsh: bringing up virtual guest",
            "[  0.042] net: outbound HTTP disabled (air-gap)",
            "[  0.133] fs: ram overlay mounted",
            "[  1.337] login: guest on ttyCRT0",
            `[  2.000] motd: ${MOTTO}`,
          ].join("\n") + "\n",
        ),
      }),
    }),
  })
}

export function splitPath(path: string): string[] {
  return path.split("/").filter(Boolean)
}

export function lookup(root: VDir, path: string): VNode | null {
  if (path === "/") return root
  let node: VNode = root
  for (const part of splitPath(path)) {
    if (node.kind !== "dir") return null
    const next: VNode | undefined = node.children[part]
    if (!next) return null
    node = next
  }
  return node
}

export function normalizePath(cwd: string, target: string | undefined, home: string): string {
  if (!target || target === "." || target === "./") return cwd
  let raw = target
  if (raw === "~" || raw === "~/") return home
  if (raw.startsWith("~/")) raw = `${home}/${raw.slice(2)}`
  if (!raw.startsWith("/")) raw = `${cwd}/${raw}`

  const parts: string[] = []
  for (const part of raw.split("/")) {
    if (!part || part === ".") continue
    if (part === "..") {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return `/${parts.join("/")}`
}

export function parentPath(path: string): string {
  if (path === "/") return "/"
  const parts = splitPath(path)
  parts.pop()
  return parts.length ? `/${parts.join("/")}` : "/"
}

export function baseName(path: string): string {
  const parts = splitPath(path)
  return parts[parts.length - 1] ?? ""
}

export function formatHome(path: string, home: string): string {
  if (path === home) return "~"
  if (path.startsWith(`${home}/`)) return `~${path.slice(home.length)}`
  return path
}

export function isDir(node: VNode | null): node is VDir {
  return node?.kind === "dir"
}

export function isFile(node: VNode | null): node is VFile {
  return node?.kind === "file"
}

export function listNames(node: VDir): string[] {
  return Object.keys(node.children).sort((a, b) => a.localeCompare(b))
}

export function fileSize(node: VFile): number {
  return node.content.length
}
