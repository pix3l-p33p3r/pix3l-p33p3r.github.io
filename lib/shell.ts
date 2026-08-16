import { interestChannels } from "@/lib/interests-data"
import { BIO, HANDLE, HOSTNAME, MOTTO, PHILOSOPHY, SCHOOL, STATUS } from "@/lib/persona"
import { projects } from "@/lib/projects"
import { skillGroups } from "@/lib/skills-data"
import {
  baseName,
  BINARIES,
  DEFAULT_PATH,
  fileSize,
  formatHome,
  GUEST_HOME,
  isDir,
  isFile,
  listNames,
  lookup,
  normalizePath,
  ROOT_HOME,
  type VDir,
} from "@/lib/vfs"

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
  | { type: "sl" }

export type ShellResult = {
  lines: ShellLine[]
  action?: ShellAction
  cwd?: string
  env?: Record<string, string>
}

export type ShellContext = {
  cwd: string
  root: boolean
  matrix: boolean
  env: Record<string, string>
  vfs: VDir
  history: string[]
}

const MAX_CMD = 512

export function defaultEnv(root = false): Record<string, string> {
  return {
    HOME: root ? ROOT_HOME : GUEST_HOME,
    USER: root ? "root" : "guest",
    LOGNAME: root ? "root" : "guest",
    PATH: DEFAULT_PATH,
    SHELL: "/bin/vsh",
    HOSTNAME,
    HOST: HOSTNAME,
    TERM: "crt-256color",
    PWD: root ? ROOT_HOME : GUEST_HOME,
    STATUS,
    SCHOOL,
    HANDLE,
  }
}

function out(text: string, tone: ShellTone = "out"): ShellLine {
  return { tone, text }
}

function lines(...texts: string[]): ShellLine[] {
  return texts.map((text) => out(text))
}

const HELP_GROUPS: Record<string, { title: string; commands: string[]; note: string }> = {
  nav: {
    title: "nav",
    commands: ["help", "man", "clear", "pwd", "ls", "cd", "cat", "tree", "open", "projects", "skills", "resume", "contact", "blog"],
    note: "cwd, files, and site jumps",
  },
  me: {
    title: "me",
    commands: ["whoami", "motto", "bio", "status", "neofetch", "id"],
    note: "the human behind the CRT",
  },
  unix: {
    title: "unix",
    commands: ["echo", "env", "export", "which", "head", "tail", "wc", "grep", "file", "stat", "date", "uname"],
    note: "guest userland — no host, no net",
  },
  toys: {
    title: "toys",
    commands: ["ping", "fortune", "cowsay", "matrix", "sl"],
    note: "not useful. very necessary.",
  },
  traps: {
    title: "traps",
    commands: ["sudo", "vim", "emacs", "rm", "ssh", "hack", "curl"],
    note: "you can type these. outcomes vary.",
  },
  hint: {
    title: "hint",
    commands: ["42", "1337", "peep", "secret"],
    note: "Konami (click off the input first). skip boot with any key.",
  },
}

function groupHelp(name: string): string[] {
  const group = HELP_GROUPS[name]
  if (!group) return helpText(false)
  return [`${group.title} — ${group.note}`, `try: ${group.commands.join("  ")}`]
}

function helpText(root: boolean): string[] {
  const rows = [
    "vsh 0.5 — virtual guest shell. PATH=/bin:/usr/bin. no host exec, no net, 512B cmds.",
    "pipes: cmd | grep|head|tail|wc    quotes work    $HOME expands    ~ is $HOME",
    "",
    "nav     help  man  ls  cd  cat  tree  open  projects  skills  resume  contact  blog",
    "unix    echo  env  export  which  head  tail  wc  grep  file  stat  date  uname",
    "me      whoami  motto  bio  status  neofetch  id",
    "toys    ping  fortune  cowsay  matrix  sl",
    "traps   sudo  vim  emacs  rm  ssh  hack  curl",
    "hint    42  1337  peep   (Konami off-input → secret)",
  ]
  if (root) rows.push("root    secret  peep")
  rows.push("", "type a label (unix, toys, hint, …) to list just that group.")
  return rows
}

const MAN: Record<string, string[]> = {
  vsh: ["VSH(1)", "virtual guest shell — air-gapped, limited, intentional.", "no fork, no execve, no sockets. files live in a ram tree."],
  ls: ["LS(1)", "list directory contents", "usage: ls [-la] [path]"],
  cat: ["CAT(1)", "concatenate files", "usage: cat <file>"],
  cd: ["CD(1)", "change directory", "usage: cd [path]"],
  pwd: ["PWD(1)", "print working directory"],
  echo: ["ECHO(1)", "write arguments", "usage: echo [-n] [string...]  ($VAR expands)"],
  man: ["MAN(1)", "manual pages for guest binaries", "usage: man <name>"],
  env: ["ENV(1)", "print the guest environment"],
  export: ["EXPORT(1)", "set an environment variable", "usage: export NAME=value"],
  grep: ["GREP(1)", "filter lines", "usage: grep [-i] <pattern> [file]  or pipe"],
  head: ["HEAD(1)", "first lines", "usage: head [-n N] [file]"],
  tail: ["TAIL(1)", "last lines", "usage: tail [-n N] [file]"],
  wc: ["WC(1)", "line / word / byte counts", "usage: wc [file]"],
  tree: ["TREE(1)", "directory tree", "usage: tree [path]"],
  file: ["FILE(1)", "guess file type", "usage: file <path>"],
  stat: ["STAT(1)", "file status", "usage: stat <path>"],
  which: ["WHICH(1)", "locate a binary on PATH"],
  help: ["HELP(1)", "vsh command groups", "usage: help [nav|me|unix|toys|traps|hint]"],
}

function suggestCommand(cmd: string): string[] {
  const catalog = [...COMMAND_NAMES, ...Object.keys(HELP_GROUPS)]
  const exactGroup = HELP_GROUPS[cmd]
  if (exactGroup) return exactGroup.commands.slice(0, 4)

  const scored = catalog
    .map((name) => {
      if (name === cmd) return { name, score: 0 }
      if (name.startsWith(cmd) || cmd.startsWith(name)) return { name, score: 1 }
      if (name.includes(cmd) || cmd.includes(name)) return { name, score: 2 }
      const letters = new Set(name)
      const overlap = [...cmd].filter((ch) => letters.has(ch)).length
      return { name, score: overlap >= 3 ? 4 : 9 }
    })
    .filter((row) => row.score < 5)
    .sort((left, right) => left.score - right.score || left.name.localeCompare(right.name))

  return [...new Set(scored.map((row) => row.name))].slice(0, 3)
}

function unknown(cmd: string): ShellResult {
  const group = HELP_GROUPS[cmd]
  if (group) {
    return { lines: groupHelp(cmd).map((text) => out(text, "sys")) }
  }

  const suggestions = suggestCommand(cmd)
  return {
    lines: [
      out(`vsh: ${cmd}: command not found`, "err"),
      out(
        suggestions.length
          ? `did you mean: ${suggestions.join(" · ")}   (or type help)`
          : "type `help` — or guess. guessing is a personality trait here.",
        "sys",
      ),
    ],
  }
}

function projectByQuery(query: string) {
  const q = query.toLowerCase()
  return projects.find((p) => p.slug === q || p.title.toLowerCase() === q || p.slug.includes(q))
}

function neofetch(ctx: ShellContext): string[] {
  const user = ctx.env.USER ?? "guest"
  return [
    "        .--.          " + `${user}@${HOSTNAME}`,
    "       |o_o |         ----------------- ",
    "       |:_/ |         OS     CRT-Linux 14.2 (scanline)",
    "      //   \\ \\        Host   www.pixel-peeper.tech",
    "     (|     | )       Kernel vsh 0.5-peeper",
    "    /'\\_   _/`\\       Shell  /bin/vsh (virtual, limited)",
    "    \\___)=(___/       Uptime since the last `clear`",
    `                      School ${SCHOOL}`,
    `                      Motto  ${MOTTO}`,
  ]
}

const FORTUNES = [
  MOTTO,
  PHILOSOPHY,
  "Hardened clusters, not vibes.",
  "If it compiles on the first try, you probably forgot a test.",
  "Vault is just spicy keychain. I still love it.",
  "There is no cloud. just someone else's homelab with better billing.",
  "rm -rf is a love language. snapshots are a prenup.",
  "42 is the answer. the question is still in code review.",
  "NixOS: it works on my flake.",
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

function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ""
  let quote: '"' | "'" | null = null
  for (const ch of input) {
    if (quote) {
      if (ch === quote) {
        quote = null
        continue
      }
      current += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (/\s/.test(ch)) {
      if (current) tokens.push(current)
      current = ""
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

function expandVars(token: string, env: Record<string, string>): string {
  return token
    .replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, key: string) => env[key] ?? "")
    .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, key: string) => env[key] ?? "")
}

function splitPipes(raw: string): string[] {
  const parts: string[] = []
  let current = ""
  let quote: '"' | "'" | null = null
  for (const ch of raw) {
    if (quote) {
      current += ch
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      current += ch
      continue
    }
    if (ch === "|") {
      parts.push(current.trim())
      current = ""
      continue
    }
    current += ch
  }
  if (current.trim()) parts.push(current.trim())
  return parts.filter(Boolean)
}

function homeOf(ctx: ShellContext): string {
  return ctx.env.HOME || (ctx.root ? ROOT_HOME : GUEST_HOME)
}

function resolve(ctx: ShellContext, target?: string): string {
  return normalizePath(ctx.cwd, target, homeOf(ctx))
}

function readFile(ctx: ShellContext, target: string): { ok: true; text: string } | { ok: false; err: string } {
  const path = resolve(ctx, target)
  const node = lookup(ctx.vfs, path)
  if (!node) return { ok: false, err: `${target}: no such file or directory` }
  if (isDir(node)) return { ok: false, err: `${target}: is a directory` }
  return { ok: true, text: node.content.replace(/\n$/, "") }
}

function stdinOrFile(ctx: ShellContext, args: string[], stdin: string[]): { ok: true; text: string[] } | { ok: false; err: string } {
  const fileArg = args.find((arg) => !arg.startsWith("-"))
  if (fileArg) {
    const result = readFile(ctx, fileArg)
    if (!result.ok) return result
    return { ok: true, text: result.text.split("\n") }
  }
  return { ok: true, text: stdin }
}

function parseDashN(args: string[], fallback: number): { n: number; rest: string[] } {
  const rest: string[] = []
  let n = fallback
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === "-n" && args[i + 1]) {
      n = Number.parseInt(args[i + 1] ?? "", 10) || fallback
      i += 1
      continue
    }
    const match = arg.match(/^-n(\d+)$/)
    if (match) {
      n = Number.parseInt(match[1] ?? "", 10) || fallback
      continue
    }
    rest.push(arg)
  }
  return { n: Math.max(0, n), rest }
}

function lsLong(ctx: ShellContext, path: string, node: VDir | ReturnType<typeof lookup>): string[] {
  if (!node) return []
  if (isFile(node)) {
    const mode = node.executable ? "-rwxr-xr-x" : "-rw-r--r--"
    return [`${mode} 1 ${ctx.env.USER} guest ${String(fileSize(node)).padStart(5)} ${baseName(path)}`]
  }
  if (!isDir(node)) return []
  return listNames(node).map((name) => {
    const child = node.children[name]
    if (!child) return name
    if (isDir(child)) return `drwxr-xr-x 1 ${ctx.env.USER} guest     0 ${name}/`
    const mode = child.executable ? "-rwxr-xr-x" : "-rw-r--r--"
    return `${mode} 1 ${ctx.env.USER} guest ${String(fileSize(child)).padStart(5)} ${name}`
  })
}

function treeWalk(node: VDir, prefix: string, depth: number, maxDepth: number): string[] {
  if (depth >= maxDepth) return []
  const names = listNames(node)
  const rows: string[] = []
  names.forEach((name, index) => {
    const child = node.children[name]
    if (!child) return
    const last = index === names.length - 1
    const branch = last ? "└── " : "├── "
    const label = isDir(child) ? `${name}/` : name
    rows.push(`${prefix}${branch}${label}`)
    if (isDir(child)) {
      rows.push(...treeWalk(child, `${prefix}${last ? "    " : "│   "}`, depth + 1, maxDepth))
    }
  })
  return rows
}

function which(ctx: ShellContext, name: string): string | null {
  if (name.includes("/")) {
    const path = resolve(ctx, name)
    const node = lookup(ctx.vfs, path)
    return isFile(node) && node.executable ? path : null
  }
  for (const dirPath of (ctx.env.PATH || DEFAULT_PATH).split(":")) {
    const path = `${dirPath}/${name}`.replace(/\/+/g, "/")
    const node = lookup(ctx.vfs, path)
    if (isFile(node) && node.executable) return path
  }
  return null
}

function resolveCommandName(rawCmd: string, ctx: ShellContext): string {
  if (rawCmd.includes("/")) {
    const path = resolve(ctx, rawCmd)
    const node = lookup(ctx.vfs, path)
    if (isFile(node) && node.executable) return baseName(path)
    return rawCmd
  }
  if (which(ctx, rawCmd)) return rawCmd
  return rawCmd
}

export const COMMAND_NAMES = [
  "help",
  "man",
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "tree",
  "file",
  "stat",
  "head",
  "tail",
  "wc",
  "grep",
  "which",
  "type",
  "env",
  "printenv",
  "export",
  "echo",
  "printf",
  "true",
  "false",
  "history",
  "hostname",
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
  "date",
  "uname",
  "ping",
  "fortune",
  "cowsay",
  "sl",
  "matrix",
  "sudo",
  "vim",
  "emacs",
  "rm",
  "ssh",
  "hack",
  "curl",
  "wget",
  "secret",
  "peep",
  "42",
  "1337",
  "nav",
  "me",
  "unix",
  "toys",
  "traps",
  "hint",
  "exit",
] as const

export function completeCommand(partial: string, ctx: Pick<ShellContext, "cwd" | "env" | "vfs">): string | null {
  const [rawCmd = "", ...rest] = partial.trim().split(/\s+/)
  if (!partial.includes(" ")) {
    const hits = COMMAND_NAMES.filter((name) => name.startsWith(rawCmd.toLowerCase()))
    return hits.length === 1 ? hits[0] : null
  }

  const cmd = rawCmd.toLowerCase()
  const arg = rest.join(" ")
  if (["cd", "ls", "cat", "open", "tree", "file", "stat", "head", "tail", "wc", "man"].includes(cmd)) {
    const dirPath = arg.includes("/") ? resolve({ ...ctx, root: false, matrix: false, history: [] }, arg.replace(/[^/]*$/, "") || ".") : ctx.cwd
    const node = lookup(ctx.vfs, dirPath)
    if (!isDir(node)) return null
    const prefix = arg.split("/").pop() ?? arg
    const hits = listNames(node).filter((entry) => entry.startsWith(prefix))
    if (hits.length === 1) {
      const dirPrefix = arg.includes("/") ? arg.slice(0, arg.lastIndexOf("/") + 1) : ""
      return `${cmd} ${dirPrefix}${hits[0]}`
    }
  }
  return null
}

function applySiteAction(kind: "projects" | "skills" | "resume" | "contact" | "blog"): ShellResult {
  switch (kind) {
    case "projects":
      return {
        lines: projects.map((p) =>
          out(`${p.slug.padEnd(22)} ${p.title}  ${p.visibility === "public" ? "public" : "42"}`),
        ),
        action: { type: "scroll", id: "projects" },
      }
    case "skills":
      return {
        lines: [
          ...skillGroups.flatMap((group) => [out(`${group.title}: ${group.items.map((item) => item.name).join(" · ")}`)]),
          out(`INTERESTS: ${interestChannels.map((ch) => ch.callsign).join(" · ")}`, "sys"),
        ],
        action: { type: "scroll", id: "skills" },
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
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

function runSingle(raw: string, ctx: ShellContext, stdin: string[]): ShellResult {
  const tokens = tokenize(raw).map((token) => expandVars(token, ctx.env))
  if (!tokens.length) return { lines: [] }

  const invoked = tokens[0] ?? ""
  const args = tokens.slice(1)
  const cmd = resolveCommandName(invoked, ctx).toLowerCase()
  const arg = args.join(" ")

  switch (cmd) {
    case "help":
    case "?":
      if (args[0] && HELP_GROUPS[args[0].toLowerCase()]) {
        return { lines: groupHelp(args[0].toLowerCase()).map((text) => out(text, "sys")) }
      }
      return { lines: helpText(ctx.root).map((text) => out(text, "sys")) }
    case "nav":
    case "me":
    case "unix":
    case "toys":
    case "traps":
    case "hint":
      return { lines: groupHelp(cmd).map((text) => out(text, "sys")) }
    case "man": {
      if (!args[0]) return { lines: [out("what manual page do you want?", "err")] }
      const page = MAN[args[0].toLowerCase()]
      if (!page) return { lines: [out(`No manual entry for ${args[0]}`, "err")] }
      return { lines: page.map((text) => out(text, "sys")) }
    }
    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } }
    case "pwd":
      return { lines: [out(ctx.cwd)] }
    case "ls": {
      const long = args.includes("-l") || args.includes("-la") || args.includes("-al")
      const all = args.includes("-a") || args.includes("-la") || args.includes("-al")
      const target = args.find((item) => !item.startsWith("-"))
      const path = resolve(ctx, target)
      const node = lookup(ctx.vfs, path)
      if (!node) return { lines: [out(`ls: ${path}: no such file or directory`, "err")] }
      if (isFile(node)) {
        return { lines: [out(long ? lsLong(ctx, path, node)[0] ?? baseName(path) : baseName(path), "accent")] }
      }
      if (!isDir(node)) return { lines: [out(`ls: ${path}: not a directory`, "err")] }
      const names = listNames(node).map((name) => (isDir(node.children[name]) ? `${name}/` : name))
      const shown = all ? ["./ ", "../ ", ...names] : names
      if (long) {
        const rows = lsLong(ctx, path, node)
        return { lines: (all ? [`drwxr-xr-x 1 ${ctx.env.USER} guest     0 .`, `drwxr-xr-x 1 ${ctx.env.USER} guest     0 ..`, ...rows] : rows).map((text) => out(text, "accent")) }
      }
      return { lines: [out(shown.join("  "), "accent")] }
    }
    case "cd": {
      const next = resolve(ctx, args[0] ?? "~")
      const node = lookup(ctx.vfs, next)
      if (!node) return { lines: [out(`cd: ${args[0] ?? next}: no such file or directory`, "err")] }
      if (!isDir(node)) return { lines: [out(`cd: ${args[0] ?? next}: not a directory`, "err")] }
      return {
        lines: [out(next === ctx.cwd ? "" : `cwd → ${formatHome(next, homeOf(ctx))}`, "sys")].filter((line) => line.text),
        cwd: next,
        env: { ...ctx.env, PWD: next },
      }
    }
    case "cat": {
      if (stdin.length && !args.length) return { lines: stdin.map((text) => out(text)) }
      if (!args.length) return { lines: [out("cat: missing file operand", "err")] }
      const chunks: ShellLine[] = []
      for (const fileArg of args) {
        if (fileArg.startsWith("-")) continue
        const result = readFile(ctx, fileArg)
        if (!result.ok) return { lines: [out(`cat: ${result.err}`, "err")] }
        chunks.push(...result.text.split("\n").map((text) => out(text)))
      }
      if (chunks.length) return { lines: chunks }

      if (arg === "motto.txt" || arg === "motto") return { lines: [out(MOTTO, "accent")] }
      if (arg === "bio.txt" || arg === "bio") return { lines: lines(BIO) }
      if (arg === "resume.pdf") {
        return {
          lines: [out("opening resume.pdf … don't print it in comic sans.", "sys")],
          action: { type: "download", href: "/cv/pix3l_p33p3r_resume.pdf", filename: "Pixel_Peeper_Resume.pdf" },
        }
      }
      const project = projectByQuery(arg.replace(/^projects\//, "").replace(/\.txt$/, ""))
      if (project) {
        return {
          lines: [
            out(project.title, "accent"),
            out(project.summary),
            out(project.tags.join(" · "), "sys"),
            out(project.repoUrl ?? "(no public clone)", "sys"),
          ],
        }
      }
      return { lines: [out(`cat: ${arg}: no such file`, "err")] }
    }
    case "tree": {
      const path = resolve(ctx, args[0])
      const node = lookup(ctx.vfs, path)
      if (!node) return { lines: [out(`tree: ${path}: no such file or directory`, "err")] }
      if (!isDir(node)) return { lines: [out(baseName(path))] }
      return { lines: [out(path, "accent"), ...treeWalk(node, "", 0, 4).map((text) => out(text))] }
    }
    case "file": {
      if (!args[0]) return { lines: [out("file: missing operand", "err")] }
      const path = resolve(ctx, args[0])
      const node = lookup(ctx.vfs, path)
      if (!node) return { lines: [out(`${args[0]}: cannot open (no such file)`, "err")] }
      if (isDir(node)) return { lines: [out(`${args[0]}: directory`)] }
      if (node.executable) return { lines: [out(`${args[0]}: vsh executable`)] }
      return { lines: [out(`${args[0]}: ASCII text`)] }
    }
    case "stat": {
      if (!args[0]) return { lines: [out("stat: missing operand", "err")] }
      const path = resolve(ctx, args[0])
      const node = lookup(ctx.vfs, path)
      if (!node) return { lines: [out(`stat: ${args[0]}: no such file or directory`, "err")] }
      if (isDir(node)) {
        return { lines: [out(`  File: ${path}`), out("  Type: directory"), out(`  Name: ${listNames(node).length} entries`)] }
      }
      return {
        lines: [
          out(`  File: ${path}`),
          out(`  Size: ${fileSize(node)}`),
          out(`  Type: ${node.executable ? "executable" : "regular file"}`),
        ],
      }
    }
    case "head": {
      const { n, rest } = parseDashN(args, 10)
      const data = stdinOrFile(ctx, rest, stdin)
      if (!data.ok) return { lines: [out(`head: ${data.err}`, "err")] }
      return { lines: data.text.slice(0, n).map((text) => out(text)) }
    }
    case "tail": {
      const { n, rest } = parseDashN(args, 10)
      const data = stdinOrFile(ctx, rest, stdin)
      if (!data.ok) return { lines: [out(`tail: ${data.err}`, "err")] }
      return { lines: data.text.slice(-n).map((text) => out(text)) }
    }
    case "wc": {
      const data = stdinOrFile(ctx, args, stdin)
      if (!data.ok) return { lines: [out(`wc: ${data.err}`, "err")] }
      const text = data.text.join("\n")
      const wcLines = data.text.length
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      return { lines: [out(`${String(wcLines).padStart(8)}${String(words).padStart(8)}${String(text.length).padStart(8)}`)] }
    }
    case "grep": {
      const ignoreCase = args.includes("-i")
      const pattern = args.find((item) => !item.startsWith("-"))
      if (!pattern) return { lines: [out("grep: missing pattern", "err")] }
      const fileArgs = args.filter((item) => !item.startsWith("-") && item !== pattern)
      const data = stdinOrFile(ctx, fileArgs, stdin)
      if (!data.ok) return { lines: [out(`grep: ${data.err}`, "err")] }
      const needle = ignoreCase ? pattern.toLowerCase() : pattern
      const hits = data.text.filter((line) => (ignoreCase ? line.toLowerCase() : line).includes(needle))
      return { lines: hits.map((text) => out(text, "accent")) }
    }
    case "which": {
      if (!args[0]) return { lines: [out("which: missing operand", "err")] }
      const path = which(ctx, args[0])
      return path ? { lines: [out(path, "accent")] } : { lines: [out(`which: no ${args[0]} in (${ctx.env.PATH})`, "err")] }
    }
    case "type": {
      if (!args[0]) return { lines: [out("type: missing operand", "err")] }
      const path = which(ctx, args[0])
      if (path) return { lines: [out(`${args[0]} is ${path}`)] }
      if ((COMMAND_NAMES as readonly string[]).includes(args[0])) return { lines: [out(`${args[0]} is a vsh builtin`)] }
      return { lines: [out(`type: ${args[0]}: not found`, "err")] }
    }
    case "env":
    case "printenv": {
      if (args[0] && cmd === "printenv") return { lines: [out(ctx.env[args[0]] ?? "")] }
      return {
        lines: Object.entries(ctx.env)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => out(`${key}=${value}`)),
      }
    }
    case "export": {
      if (!args[0]) {
        return {
          lines: Object.entries(ctx.env)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => out(`export ${key}="${value}"`, "sys")),
        }
      }
      const joined = args.join(" ")
      const eq = joined.indexOf("=")
      if (eq < 1) return { lines: [out("export: usage: export NAME=value", "err")] }
      const key = joined.slice(0, eq)
      const value = joined.slice(eq + 1)
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return { lines: [out("export: not a valid identifier", "err")] }
      return { lines: [out(`export ${key}`, "sys")], env: { ...ctx.env, [key]: value } }
    }
    case "echo": {
      const skipNewline = args[0] === "-n"
      const text = (skipNewline ? args.slice(1) : args).join(" ")
      return { lines: [out(text)] }
    }
    case "printf":
      return { lines: [out(args.join(" ").replace(/\\n/g, "\n").replace(/%s/g, () => ""))] }
    case "true":
      return { lines: [] }
    case "false":
      return { lines: [out("", "err")].filter((line) => line.text) }
    case "history":
      return { lines: ctx.history.map((item, index) => out(`${String(index + 1).padStart(4)}  ${item}`)) }
    case "hostname":
      return { lines: [out(ctx.env.HOSTNAME || HOSTNAME)] }
    case "whoami":
      return {
        lines: ctx.root
          ? [out("root — Konami worked. don't tell the intern.", "accent")]
          : [out(`Yo, I'm ${HANDLE}, a ${SCHOOL} student`)],
      }
    case "motto":
      return { lines: [out(MOTTO, "accent")] }
    case "bio":
      return { lines: lines(BIO) }
    case "skills":
      return applySiteAction("skills")
    case "projects":
    case "ls-projects":
      return applySiteAction("projects")
    case "open": {
      if (!arg) return { lines: [out("open what? projects | blog | resume | contact | <slug>", "err")] }
      if (arg === "blog") return applySiteAction("blog")
      if (arg === "resume") return applySiteAction("resume")
      if (arg === "contact" || arg === "email") {
        return { lines: [out("opening mailto:pix3l-p33p3r@proton.me", "sys")], action: { type: "open", href: "mailto:pix3l-p33p3r@proton.me" } }
      }
      if (arg === "github") return { lines: [out("peeping github…", "sys")], action: { type: "open", href: "https://github.com/pix3l-p33p3r" } }
      if (arg === "interests") {
        return { lines: [out("tuning spectrum…", "sys")], action: { type: "scroll", id: "interests" } }
      }
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
      return applySiteAction("resume")
    case "contact":
      return applySiteAction("contact")
    case "blog":
      return applySiteAction("blog")
    case "status":
      return { lines: [out(STATUS, "accent"), out("also: caffeinated. also: compiling something. always.")] }
    case "neofetch":
    case "fastfetch":
      return { lines: neofetch(ctx).map((text) => out(text, "accent")) }
    case "id":
      return {
        lines: [
          out(
            ctx.root
              ? "uid=0(root) gid=0(root) groups=0(root),1337(peepers)"
              : "uid=1000(guest) gid=1000(guest) groups=1000(guest),1337(curious)",
          ),
        ],
      }
    case "date":
      return { lines: [out(new Date().toString())] }
    case "uname":
      if (args.includes("-a")) return { lines: [out(`CRT-Linux ${HOSTNAME} 0.5-peeper #1 SMP ${new Date().toDateString()} crt`)] }
      return { lines: [out("CRT-Linux")] }
    case "ping":
      return {
        lines: [
          out(`PING ${arg || "pixel-peeper.tech"} (127.0.0.1): 56 data bytes`),
          out("64 bytes from 127.0.0.1: icmp_seq=0 ttl=42 time=0.42 ms"),
          out("64 bytes from 127.0.0.1: icmp_seq=1 ttl=42 time=1.337 ms"),
          out("--- 2 packets transmitted, 2 received, 0% packet loss ---"),
          out("vsh: loopback only. the guest is air-gapped.", "sys"),
        ],
      }
    case "fortune":
      return { lines: [out(FORTUNES[Math.floor(Math.random() * FORTUNES.length)] ?? MOTTO, "accent")] }
    case "cowsay":
      return { lines: cowsay(arg).map((text) => out(text, "accent")) }
    case "sl":
      return {
        lines: [out("you meant ls. too late. the locomotive has opinions.", "sys")],
        action: { type: "sl" },
      }
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
        lines: [out("~", "sys"), out("~  VIM - vsh  [guest]", "accent"), out("~  type  :q  to escape. there is no other door.", "sys")],
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
    case "curl":
    case "wget":
    case "nc":
    case "nmap":
      return { lines: [out("vsh: outbound sockets disabled (air-gapped guest). peep the site instead.", "err")] }
    case "bash":
    case "sh":
    case "zsh":
    case "python":
    case "python3":
    case "node":
    case "exec":
    case "eval":
      return { lines: [out("vsh: interpreters and exec are not mounted. this is a guest, not your laptop.", "err")] }
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
    case "sleep":
      return { lines: [out("vsh: sleep is virtual — time skipped, guest did not block the tab.", "sys")] }
    case "vsh":
      return { lines: helpText(ctx.root).map((text) => out(text, "sys")) }
    default:
      if (cmd === "cd..") return runSingle("cd ..", ctx, stdin)
      return unknown(baseName(invoked) || cmd)
  }
}

export function runCommand(raw: string, ctx: ShellContext): ShellResult {
  const trimmed = raw.trim()
  if (!trimmed) return { lines: [] }
  if (trimmed.length > MAX_CMD) {
    return { lines: [out(`vsh: command too long (${MAX_CMD} byte guest limit)`, "err")] }
  }
  if (/`|\$\(/.test(trimmed)) {
    return { lines: [out("vsh: command substitution disabled in the guest.", "err")] }
  }

  const stages = splitPipes(trimmed)
  if (stages.length > 4) {
    return { lines: [out("vsh: pipe depth limited to 4 in the guest.", "err")] }
  }

  let stdin: string[] = []
  let last: ShellResult = { lines: [] }
  let env = ctx.env
  let cwd = ctx.cwd

  for (let i = 0; i < stages.length; i += 1) {
    const stage = stages[i]
    if (!stage) continue
    const stageCtx: ShellContext = { ...ctx, env, cwd }
    last = runSingle(stage, stageCtx, stdin)
    if (last.cwd) cwd = last.cwd
    if (last.env) env = last.env
    if (last.action && last.action.type !== "clear") {
      // site actions should not be swallowed by later pipe stages
    }
    stdin = last.lines.filter((line) => line.tone !== "err").map((line) => line.text)
    if (i < stages.length - 1 && last.lines.some((line) => line.tone === "err" && /not found|usage:|missing/.test(line.text))) {
      return last
    }
  }

  return { ...last, cwd, env }
}

export function applyCd(raw: string, ctx: Pick<ShellContext, "cwd" | "env" | "vfs">): string {
  const result = runCommand(raw, {
    cwd: ctx.cwd,
    env: ctx.env,
    vfs: ctx.vfs,
    root: false,
    matrix: false,
    history: [],
  })
  return result.cwd ?? ctx.cwd
}

export { MOTTO, BIO, PHILOSOPHY, STATUS }
