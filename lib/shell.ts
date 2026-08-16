import { projects } from "@/lib/projects"
import { interests, skillGroups } from "@/lib/skills-data"

export type ShellTone = "out" | "err" | "sys" | "accent"

export type ShellLine = {
  tone: ShellTone
  text: string
}

export type ShellAction =
  | { type: "clear" }
  | { type: "scroll"; id: string }
  | { type: "goto"; href: string }
  | { type: "download"; href: string; filename: string }
  | { type: "open"; href: string }
  | { type: "matrix"; on: boolean }
  | { type: "vim"; on: boolean }

export type ShellResult = {
  lines: ShellLine[]
  action?: ShellAction
}

export type ShellContext = {
  cwd: string
  root: boolean
  matrix: boolean
}

const MOTTO = "Jack of all trades, Master of none; Exploration of all, Not a prisoner of one."

const BIO =
  "A hardcore passion for tech, coding, and building dope stuff! A general jack of all trades (master of some, more to come), diving into everything from gritty assembly to slick scripting. I live for tinkering with hardware and software, always chasing the next big challenge to create something epic."

const FILES: Record<string, string[]> = {
  "~": ["motto.txt", "bio.txt", "skills.txt", "resume.pdf", "projects/"],
  "~/projects": projects.map((p) => p.slug),
}

function out(text: string, tone: ShellTone = "out"): ShellLine {
  return { tone, text }
}

function lines(...texts: string[]): ShellLine[] {
  return texts.map((text) => out(text))
}

function unknown(cmd: string): ShellResult {
  return {
    lines: [
      out(`command not found: ${cmd}`, "err"),
      out("type `help` — or guess. guessing is a personality trait here.", "sys"),
    ],
  }
}

function resolvePath(cwd: string, target?: string): string {
  if (!target || target === "~") return "~"
  if (target === ".." || target === "../") return "~"
  if (target === "projects" || target === "projects/" || target === "~/projects") return "~/projects"
  if (target.startsWith("~/")) return target.replace(/\/$/, "")
  if (cwd === "~" && (target === "." || target === "./")) return "~"
  return `${cwd}/${target}`.replace(/\/+/g, "/").replace(/\/$/, "")
}

function projectByQuery(query: string) {
  const q = query.toLowerCase()
  return projects.find((p) => p.slug === q || p.title.toLowerCase() === q || p.slug.includes(q))
}

function helpText(root: boolean): string[] {
  const common = [
    "guest@pixel-peeper — tiny TUI. not a real shell. worse: it's honest.",
    "",
    "nav     help  clear  pwd  ls  cd  cat  open  projects  skills  resume  contact  blog",
    "me      whoami  motto  bio  status  neofetch  id",
    "toys    echo  date  uname  ping  fortune  cowsay  matrix",
    "traps   sudo  vim  emacs  rm  ssh  hack",
  ]
  if (root) common.push("root    secret  peep")
  common.push("", "hint    Konami. 42. 1337. skip boot with any key.")
  return common
}

function neofetch(): string[] {
  return [
    "        .--.          guest@pixel-peeper",
    "       |o_o |         ----------------- ",
    "       |:_/ |         OS     CRT-Linux 14.2 (scanline)",
    "      //   \\ \\        Host   www.pixel-peeper.tech",
    "     (|     | )       Kernel 1337.42-peeper",
    "    /'\\_   _/`\\       Shell  psh 0.4 (personality)",
    "    \\___)=(___/       Uptime since the last `clear`",
    "                      School 1337 / UM6P",
    "                      Motto  jack of all, prisoner of none",
  ]
}

const FORTUNES = [
  MOTTO,
  "Hardened clusters, not vibes.",
  "If it compiles on the first try, you probably forgot a test.",
  "Vault is just spicy keychain. I still love it.",
  "There is no cloud. just someone else's homelab with better billing.",
  "rm -rf is a love language. snapshots are a prenup.",
  "42 is the answer. the question is still in code review.",
]

function cowsay(message: string): string[] {
  const msg = message || "peep peep"
  const bar = "-".repeat(Math.min(msg.length, 42) + 2)
  return [
    ` ${bar}`,
    `< ${msg.slice(0, 42)} >`,
    ` ${bar}`,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ]
}

export const COMMAND_NAMES = [
  "help",
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "open",
  "whoami",
  "motto",
  "bio",
  "skills",
  "projects",
  "resume",
  "contact",
  "blog",
  "status",
  "neofetch",
  "id",
  "echo",
  "date",
  "uname",
  "ping",
  "fortune",
  "cowsay",
  "matrix",
  "sudo",
  "vim",
  "emacs",
  "rm",
  "ssh",
  "hack",
  "secret",
  "peep",
  "42",
  "1337",
  "exit",
] as const

export function completeCommand(partial: string, cwd: string): string | null {
  const [rawCmd = "", ...rest] = partial.trim().split(/\s+/)
  if (!partial.includes(" ")) {
    const hits = COMMAND_NAMES.filter((name) => name.startsWith(rawCmd.toLowerCase()))
    return hits.length === 1 ? hits[0] : null
  }

  const cmd = rawCmd.toLowerCase()
  const arg = rest.join(" ")
  if (cmd === "cd" || cmd === "ls" || cmd === "cat" || cmd === "open") {
    const entries = FILES[cwd] ?? []
    const hits = entries.filter((entry) => entry.replace(/\/$/, "").startsWith(arg))
    if (hits.length === 1) return `${cmd} ${hits[0].replace(/\/$/, "")}`
  }
  return null
}

export function runCommand(raw: string, ctx: ShellContext): ShellResult {
  const trimmed = raw.trim()
  if (!trimmed) return { lines: [] }

  const [cmdRaw, ...args] = trimmed.split(/\s+/)
  const cmd = cmdRaw.toLowerCase()
  const arg = args.join(" ")

  switch (cmd) {
    case "help":
    case "?":
      return { lines: helpText(ctx.root).map((text) => out(text, "sys")) }
    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } }
    case "pwd":
      return { lines: [out(ctx.cwd)] }
    case "ls": {
      const path = resolvePath(ctx.cwd, args[0])
      const listing = FILES[path]
      if (!listing) return { lines: [out(`ls: ${path}: no such file or directory`, "err")] }
      return { lines: [out(listing.join("  "), "accent")] }
    }
    case "cd": {
      const next = resolvePath(ctx.cwd, args[0] ?? "~")
      if (!FILES[next]) return { lines: [out(`cd: ${args[0] ?? next}: no such directory`, "err")] }
      return { lines: [out(next === ctx.cwd ? "" : `cwd → ${next}`, "sys")] }
    }
    case "cat": {
      if (!arg) return { lines: [out("cat: missing file operand", "err")] }
      if (arg === "motto.txt" || arg === "motto") return { lines: [out(MOTTO, "accent")] }
      if (arg === "bio.txt" || arg === "bio") return { lines: lines(BIO) }
      if (arg === "skills.txt" || arg === "skills") {
        return {
          lines: skillGroups.flatMap((group) => [
            out(group.title, "accent"),
            out(group.items.join(" · ")),
          ]),
        }
      }
      if (arg === "resume.pdf") {
        return {
          lines: [out("opening resume.pdf … don't print it in comic sans.", "sys")],
          action: { type: "download", href: "/cv/pix3l_p33p3r_resume.pdf", filename: "Pixel_Peeper_Resume.pdf" },
        }
      }
      const project = projectByQuery(arg.replace(/^projects\//, ""))
      if (project) {
        return {
          lines: [
            out(project.title, "accent"),
            out(project.summary),
            out(project.tags.join(" · "), "sys"),
            out(project.repoUrl ?? "(private / no public repo)", "sys"),
          ],
        }
      }
      return { lines: [out(`cat: ${arg}: no such file`, "err")] }
    }
    case "whoami":
      return {
        lines: ctx.root
          ? [out("root — Konami worked. don't tell the intern.", "accent")]
          : [out("Yo, I'm @PiX3L_P33P3R, a UM6P/1337 student")],
      }
    case "motto":
      return { lines: [out(MOTTO, "accent")] }
    case "bio":
      return { lines: lines(BIO) }
    case "skills":
      return {
        lines: [
          ...skillGroups.flatMap((group) => [out(`${group.title}: ${group.items.join(" · ")}`)]),
          out(`INTERESTS: ${interests.join(" · ")}`, "sys"),
        ],
        action: { type: "scroll", id: "skills" },
      }
    case "projects":
    case "ls-projects":
      return {
        lines: projects.map((p) => out(`${p.slug.padEnd(22)} ${p.title}`)),
        action: { type: "scroll", id: "projects" },
      }
    case "open": {
      if (!arg) return { lines: [out("open what? projects | blog | resume | contact | <slug>", "err")] }
      if (arg === "blog") return { lines: [out("routing → /blog", "sys")], action: { type: "goto", href: "/blog" } }
      if (arg === "resume") {
        return {
          lines: [out("fetching pixels…", "sys")],
          action: { type: "download", href: "/cv/pix3l_p33p3r_resume.pdf", filename: "Pixel_Peeper_Resume.pdf" },
        }
      }
      if (arg === "contact" || arg === "email") {
        return { lines: [out("opening mailto:pix3l-p33p3r@proton.me", "sys")], action: { type: "open", href: "mailto:pix3l-p33p3r@proton.me" } }
      }
      if (arg === "github") return { lines: [out("peeping github…", "sys")], action: { type: "open", href: "https://github.com/pix3l-p33p3r" } }
      const project = projectByQuery(arg)
      if (project) {
        return {
          lines: [out(`opening /projects/${project.slug}`, "sys")],
          action: { type: "goto", href: `/projects/${project.slug}` },
        }
      }
      return { lines: [out(`open: ${arg}: nothing to peep`, "err")] }
    }
    case "resume":
      return {
        lines: [out("PDF inbound. paper cuts not included.", "sys")],
        action: { type: "download", href: "/cv/pix3l_p33p3r_resume.pdf", filename: "Pixel_Peeper_Resume.pdf" },
      }
    case "contact":
      return {
        lines: [
          out("email   pix3l-p33p3r@proton.me", "accent"),
          out("github  github.com/pix3l-p33p3r"),
          out("x       x.com/PiX3L_P33P3R"),
        ],
        action: { type: "scroll", id: "contact" },
      }
    case "blog":
      return { lines: [out("routing → /blog", "sys")], action: { type: "goto", href: "/blog" } }
    case "status":
      return { lines: [out("WARNING: OPEN TO WORK!", "accent"), out("also: caffeinated. also: compiling something. always.")] }
    case "neofetch":
    case "fastfetch":
      return { lines: neofetch().map((text) => out(text, "accent")) }
    case "id":
      return { lines: [out(ctx.root ? "uid=0(root) gid=0(root) groups=0(root),1337(peepers)" : "uid=1000(guest) gid=1000(guest) groups=1000(guest),1337(curious)")] }
    case "echo":
      return { lines: [out(arg || "")] }
    case "date":
      return { lines: [out(new Date().toString())] }
    case "uname":
      return { lines: [out("-psh 0.4 CRT #1 SMP peeper")] }
    case "ping":
      return {
        lines: [
          out(`PING ${arg || "pixel-peeper.tech"} (127.0.0.1): 56 data bytes`),
          out("64 bytes from 127.0.0.1: icmp_seq=0 ttl=42 time=0.42 ms"),
          out("64 bytes from 127.0.0.1: icmp_seq=1 ttl=42 time=1.337 ms"),
          out("--- 2 packets transmitted, 2 received, 0% packet loss ---"),
        ],
      }
    case "fortune":
      return { lines: [out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], "accent")] }
    case "cowsay":
      return { lines: cowsay(arg).map((text) => out(text, "accent")) }
    case "matrix":
      return {
        lines: [out(ctx.matrix ? "rain stopped. back to scanlines." : "wake up, peeper…", "accent")],
        action: { type: "matrix", on: !ctx.matrix },
      }
    case "sudo":
      if (ctx.root) return { lines: [out("you already broke in. chill.", "sys")] }
      return { lines: [out("guest is not in the sudoers file. this incident will be reported to @PiX3L_P33P3R.", "err")] }
    case "vim":
    case "vi":
      return {
        lines: [out("~", "sys"), out("~  VIM - psh  [guest]", "accent"), out("~  type  :q  to escape. there is no other door.", "sys")],
        action: { type: "vim", on: true },
      }
    case "emacs":
      return { lines: [out("C-x C-c. or just use vim. fight me.", "sys")] }
    case "rm":
      if (args.includes("-rf") || args.includes("-fr") || arg.includes("/")) {
        return { lines: [out("nice try. the homelab has snapshots. also: no.", "err")] }
      }
      return { lines: [out("rm: refusing to delete vibes without -rf (still no)", "err")] }
    case "ssh":
      return { lines: [out(`ssh: connect to host ${arg || "root@pixel-peeper.tech"} port 22: Connection refused (use the website, cowboy)`, "err")] }
    case "hack":
    case "hacktheplanet":
      return { lines: [out("it's a portfolio, not a CTF. unless… type 1337.", "sys")] }
    case "secret":
    case "easter":
      if (!ctx.root) return { lines: [out("permission denied. have you tried up up down down…", "err")] }
      return {
        lines: [
          out("EGG UNLOCKED — you found the peeper nest.", "accent"),
          out("reward: this message, a slightly warmer CRT, and my respect."),
          out(MOTTO, "sys"),
        ],
      }
    case "peep":
    case "peeper":
    case "pixel":
      return { lines: [out("👀  peep peep. that's the whole bit.", "accent")] }
    case "42":
      return { lines: [out("the answer. also a school. coincidence? in this house we don't do coincidences.", "accent")] }
    case "1337":
      return { lines: [out("l33t m0d3 3ng4g3d. w3lc0m3 t0 1337/UM6P. n0w g0 bu1ld s0m3th1ng.", "accent")] }
    case "exit":
    case "logout":
      return { lines: [out("there is no exit. only `clear`. welcome to the portfolio.", "sys")] }
    default:
      if (cmd === "cd.." ) return runCommand("cd ..", ctx)
      return unknown(cmd)
  }
}

export function applyCd(raw: string, cwd: string): string {
  const [cmd, arg] = raw.trim().split(/\s+/)
  if (cmd?.toLowerCase() !== "cd") return cwd
  const next = resolvePath(cwd, arg)
  return FILES[next] ? next : cwd
}

export { MOTTO, BIO }
