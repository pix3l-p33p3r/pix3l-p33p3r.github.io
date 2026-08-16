"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { BIO, completeCommand, defaultEnv, MOTTO, runCommand, type ShellLine } from "@/lib/shell"
import { createGuestFs, formatHome, GUEST_HOME, ROOT_HOME } from "@/lib/vfs"
import { useKonami } from "@/hooks/use-konami"
import MatrixRain from "@/components/matrix-rain"
import SteamLocomotive from "@/components/steam-locomotive"
import { trackShellCommand } from "@/lib/analytics"

const BOOT_CHAR_MS = 52
const BOOT_PAUSE_MS = 1400
const OUTPUT_CHAR_MS = 32
const OUTPUT_LINE_MS = 420

type HistoryItem = ShellLine | { tone: "in"; text: string }

type BootLine = { text: string; isPrompt: boolean }

const BOOT: { prompt: string; output: string }[] = [
  { prompt: "> whoami:", output: "Yo, I'm @PiX3L_P33P3R, a UM6P/1337 student" },
  { prompt: "> cat motto.txt", output: MOTTO },
  { prompt: "> cat bio.txt", output: BIO },
  { prompt: "> echo $STATUS", output: "WARNING: OPEN TO WORK!" },
]

const BOOT_DONE_MS = 1600

function bootLinesAt(index: number, char: number): BootLine[] {
  const done: BootLine[] = []
  for (const item of BOOT.slice(0, index)) {
    done.push({ text: item.prompt, isPrompt: true })
    done.push({ text: item.output, isPrompt: false })
  }
  if (index >= BOOT.length) return done
  const current = BOOT[index]
  const full = `${current.prompt}\n${current.output}`
  return [
    ...done,
    ...full.slice(0, char).split("\n").map((line, lineIndex) => ({
      text: line,
      isPrompt: lineIndex === 0,
    })),
  ]
}

function downloadFile(href: string, filename: string) {
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function toneClass(tone: HistoryItem["tone"]): string {
  switch (tone) {
    case "in":
      return "text-[#ff4800]"
    case "err":
      return "text-[#ff6b4a]"
    case "sys":
      return "text-white/45"
    case "accent":
      return "text-[#00ffff]"
    case "out":
      return "text-[#9ef6f6]"
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

export default function About() {
  const [booting, setBooting] = useState(true)
  const [bootIndex, setBootIndex] = useState(0)
  const [bootChar, setBootChar] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [input, setInput] = useState("")
  const [cwd, setCwd] = useState(GUEST_HOME)
  const [env, setEnv] = useState(() => defaultEnv(false))
  const [root, setRoot] = useState(false)
  const vfs = useMemo(() => createGuestFs(), [])
  const [matrix, setMatrix] = useState(false)
  const [vim, setVim] = useState(false)
  const [train, setTrain] = useState(false)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdCursor, setCmdCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const glitchRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const printGen = useRef(0)

  const teleprompter = useMemo(() => bootLinesAt(bootIndex, bootChar), [bootChar, bootIndex])

  const finishBoot = useCallback((opts?: { focus?: boolean }) => {
    setBooting(false)
    setHistory([])
    if (opts?.focus !== false) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [])

  useEffect(() => {
    if (!booting) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (bootIndex >= BOOT.length) {
      const done = setTimeout(() => finishBoot({ focus: true }), BOOT_DONE_MS)
      return () => clearTimeout(done)
    }

    const current = BOOT[bootIndex]
    const full = `${current.prompt}\n${current.output}`

    if (bootChar === 0) {
      setIsGlitching(true)
      if (glitchRef.current) clearTimeout(glitchRef.current)
      glitchRef.current = setTimeout(() => setIsGlitching(false), 400)
    }

    if (bootChar < full.length) {
      const timer = setTimeout(() => setBootChar((n) => n + 1), BOOT_CHAR_MS)
      return () => clearTimeout(timer)
    }

    const next = setTimeout(() => {
      setBootIndex((n) => n + 1)
      setBootChar(0)
    }, BOOT_PAUSE_MS)
    return () => clearTimeout(next)
  }, [bootChar, bootIndex, booting, finishBoot])

  useEffect(() => {
    return () => {
      if (glitchRef.current) clearTimeout(glitchRef.current)
    }
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setBootIndex(BOOT.length)
    setBootChar(0)
    const done = setTimeout(() => finishBoot({ focus: true }), BOOT_PAUSE_MS)
    return () => clearTimeout(done)
  }, [finishBoot])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [history, teleprompter, input, booting])

  const printLines = useCallback(async (lines: ShellLine[]) => {
    const gen = ++printGen.current
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setHistory((prev) => [...prev, ...lines])
      return
    }

    for (const line of lines) {
      if (gen !== printGen.current) return
      let built = ""
      setHistory((prev) => [...prev, { tone: line.tone, text: "" }])
      const step = line.text.length > 100 ? 10 : OUTPUT_CHAR_MS
      for (const ch of line.text) {
        if (gen !== printGen.current) return
        built += ch
        const snapshot = built
        setHistory((prev) => {
          const next = [...prev]
          next[next.length - 1] = { tone: line.tone, text: snapshot }
          return next
        })
        await new Promise((resolve) => setTimeout(resolve, step))
      }
      await new Promise((resolve) => setTimeout(resolve, OUTPUT_LINE_MS))
    }
  }, [])

  const run = useCallback(
    (raw: string) => {
      const typed = raw.trim()
      if (!typed) return
      trackShellCommand(typed.split(/\s+/)[0] ?? typed)
      const result = runCommand(typed, { cwd, root, matrix, env, vfs, history: cmdHistory })
      if (result.cwd) setCwd(result.cwd)
      if (result.env) setEnv(result.env)
      setCmdHistory((prev) => (typed === prev[prev.length - 1] ? prev : [...prev, typed]))
      setCmdCursor(-1)

      if (result.action?.type === "clear") {
        printGen.current += 1
        setHistory([])
        return
      }

      const user = root ? "root" : "guest"
      const shown = formatHome(cwd, env.HOME || GUEST_HOME)
      setHistory((prev) => [...prev, { tone: "in", text: `${user}@pixel-peeper:${shown}$ ${typed}` }])
      void printLines(result.lines)

      const action = result.action
      if (!action) return
      switch (action.type) {
        case "scroll":
          document.getElementById(action.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
          break
        case "goto":
          window.location.href = action.href
          break
        case "open":
          window.open(action.href, "_blank", "noopener,noreferrer")
          break
        case "download":
          downloadFile(action.href, action.filename)
          break
        case "matrix":
          setMatrix(action.on)
          break
        case "vim":
          setVim(action.on)
          break
        case "sl":
          setTrain(true)
          break
        default: {
          const _exhaustive: never = action
          return _exhaustive
        }
      }
    },
    [cmdHistory, cwd, env, matrix, printLines, root, vfs],
  )

  const onUnlock = useCallback(() => {
    setRoot(true)
    setEnv((prev) => ({ ...prev, USER: "root", LOGNAME: "root", HOME: ROOT_HOME, PWD: ROOT_HOME }))
    setCwd(ROOT_HOME)
    setHistory((prev) => [
      ...prev,
      { tone: "accent", text: "KONAMI ACCEPTED — uid flipped to root. try `secret`." },
    ])
  }, [])

  useKonami(onUnlock)

  useEffect(() => {
    const focusShell = () => {
      if (booting) return
      inputRef.current?.focus()
    }
    const onHotkey = (event: globalThis.KeyboardEvent) => {
      const target = event.target
      const typingInField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      if (event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (typingInField && target === inputRef.current) return
        event.preventDefault()
        focusShell()
      }
    }
    window.addEventListener("pixel-shell-focus", focusShell)
    window.addEventListener("keydown", onHotkey)
    return () => {
      window.removeEventListener("pixel-shell-focus", focusShell)
      window.removeEventListener("keydown", onHotkey)
    }
  }, [booting])

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (vim) {
      if (event.key === "Escape") {
        event.preventDefault()
        setVim(false)
        setInput("")
        setHistory((prev) => [...prev, { tone: "sys", text: "E32: no write since last change (just kidding). quit." }])
        return
      }
      if (event.key === "Enter") {
        event.preventDefault()
        const cmd = input.trim().replace(/^:/, "")
        if (cmd === "q" || cmd === "wq" || cmd === "q!") {
          setVim(false)
          setInput("")
          setHistory((prev) => [...prev, { tone: "sys", text: "closed 1 buffer. you survived vim. respect." }])
        } else {
          setInput("")
          setHistory((prev) => [...prev, { tone: "err", text: "E492: not an editor command (try :q)" }])
        }
      }
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      run(input)
      setInput("")
      return
    }
    if (event.key === "Tab") {
      event.preventDefault()
      const completed = completeCommand(input, { cwd, env, vfs })
      if (completed) setInput(completed)
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!cmdHistory.length) return
      const next = cmdCursor < 0 ? cmdHistory.length - 1 : Math.max(0, cmdCursor - 1)
      setCmdCursor(next)
      setInput(cmdHistory[next] ?? "")
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (cmdCursor < 0) return
      const next = cmdCursor + 1
      if (next >= cmdHistory.length) {
        setCmdCursor(-1)
        setInput("")
        return
      }
      setCmdCursor(next)
      setInput(cmdHistory[next] ?? "")
    }
  }

  const prompt = vim ? ":" : `${root ? "root" : "guest"}@pixel-peeper:${formatHome(cwd, env.HOME || GUEST_HOME)}$`

  return (
    <section id="about" className="mb-0">
      <MatrixRain active={matrix} />
      <SteamLocomotive active={train} onDone={() => setTrain(false)} />
      <div className="sr-only">
        Interactive portfolio shell. After the boot teleprompter, type help at the guest prompt.
      </div>
      <div
        role="application"
        aria-label="Interactive about terminal"
        onClick={() => {
          if (booting) return
          inputRef.current?.focus()
        }}
        className={`font-mono text-sm md:text-base leading-relaxed h-40 md:h-64 overflow-hidden relative p-3 md:p-4 bg-black/55 border border-[#333] shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] rounded flex flex-col ${isGlitching ? "glitch" : ""} ${root ? "shadow-[inset_0_0_28px_rgba(255,72,0,0.18)]" : ""}`}
      >
        <div className="flex items-center justify-between text-[11px] md:text-xs tracking-wider text-white/70 md:text-white/40 border-b border-[#333] pb-2 mb-2 shrink-0">
          <span className="text-[#00ffff]/80">{root ? "root@pixel-peeper" : "guest@pixel-peeper"} — vsh</span>
          <span>{booting ? "BOOT" : vim ? "VIM" : "READY"} · ` focus</span>
        </div>

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto no-scrollbar space-y-0.5">
          {booting ? (
            <div>
              {teleprompter.map((line, index) => (
                <span key={`${index}-${line.isPrompt ? "p" : "o"}-${line.text.length}`} className={line.isPrompt ? "text-[#ff4800]" : "text-[#00ffff]"}>
                  {line.text}
                  {index < teleprompter.length - 1 ? <br /> : null}
                </span>
              ))}
              <span className="text-[#ff4800] animate-blink-cursor" aria-hidden="true">
                |
              </span>
            </div>
          ) : (
            history.map((line, index) => (
              <div key={`${index}-${line.text}`} className={`whitespace-pre-wrap break-words ${toneClass(line.tone)}`}>
                {line.text}
              </div>
            ))
          )}

          {booting ? null : (
            <div className="flex gap-2 items-center pt-1">
              <label htmlFor="pixel-shell-input" className="text-[#ff4800] shrink-0">
                {prompt}
              </label>
              <input
                id="pixel-shell-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Shell command"
                className="flex-1 bg-transparent border-0 outline-none text-[#00ffff] caret-[#ff4800] min-w-0"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
