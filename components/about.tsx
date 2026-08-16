"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { applyCd, BIO, completeCommand, MOTTO, runCommand, type ShellLine } from "@/lib/shell"
import { useKonami } from "@/hooks/use-konami"
import MatrixRain from "@/components/matrix-rain"

type HistoryItem = ShellLine | { tone: "in"; text: string }

const BOOT: { prompt: string; output: string }[] = [
  { prompt: "> whoami:", output: "Yo, I'm @PiX3L_P33P3R, a UM6P/1337 student" },
  { prompt: "> cat motto.txt", output: MOTTO },
  { prompt: "> cat bio.txt", output: BIO },
  { prompt: "> echo $STATUS", output: "WARNING: OPEN TO WORK!" },
]

const BOOT_HINT: HistoryItem[] = [
  { tone: "sys", text: "boot complete. this box is a shell now." },
  { tone: "sys", text: "type `help` · press ` to refocus · Konami if you're nosy" },
]

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
  const [bootLines, setBootLines] = useState<{ text: string; isPrompt: boolean }[]>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [input, setInput] = useState("")
  const [cwd, setCwd] = useState("~")
  const [root, setRoot] = useState(false)
  const [matrix, setMatrix] = useState(false)
  const [vim, setVim] = useState(false)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdCursor, setCmdCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const glitchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const finishBoot = useCallback(() => {
    setBooting(false)
    setHistory(BOOT_HINT)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!booting) return
    if (bootIndex >= BOOT.length) {
      const done = setTimeout(finishBoot, 700)
      return () => clearTimeout(done)
    }

    const current = BOOT[bootIndex]
    const full = `${current.prompt}\n${current.output}\n`

    if (bootChar === 0) {
      setIsGlitching(true)
      if (glitchRef.current) clearTimeout(glitchRef.current)
      glitchRef.current = setTimeout(() => setIsGlitching(false), 400)
    }

    if (bootChar < full.length) {
      const timer = setTimeout(() => {
        const slice = full.slice(0, bootChar + 1)
        setBootLines(
          slice.split("\n").map((line, index) => ({
            text: line,
            isPrompt: index === 0 && line.startsWith(">"),
          })),
        )
        setBootChar((n) => n + 1)
      }, 18)
      return () => clearTimeout(timer)
    }

    const next = setTimeout(() => {
      setBootIndex((n) => n + 1)
      setBootChar(0)
    }, 280)
    return () => clearTimeout(next)
  }, [bootChar, bootIndex, booting, finishBoot])

  useEffect(() => {
    return () => {
      if (glitchRef.current) clearTimeout(glitchRef.current)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishBoot()
    }
  }, [finishBoot])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [history, bootLines, input, booting])

  const run = useCallback(
    (raw: string) => {
      const typed = raw.trim()
      if (!typed) return
      const result = runCommand(typed, { cwd, root, matrix })
      const nextCwd = applyCd(typed, cwd)
      setCwd(nextCwd)
      setCmdHistory((prev) => (typed === prev[prev.length - 1] ? prev : [...prev, typed]))
      setCmdCursor(-1)

      if (result.action?.type === "clear") {
        setHistory([])
        return
      }

      setHistory((prev) => [
        ...prev,
        { tone: "in", text: `guest@pixel-peeper:${cwd}$ ${typed}` },
        ...result.lines,
      ])

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
        default: {
          const _exhaustive: never = action
          return _exhaustive
        }
      }
    },
    [cwd, matrix, root],
  )

  const onUnlock = useCallback(() => {
    setRoot(true)
    setHistory((prev) => [
      ...prev,
      { tone: "accent", text: "KONAMI ACCEPTED — uid flipped to root. try `secret`." },
    ])
  }, [])

  useKonami(onUnlock)

  useEffect(() => {
    const focusShell = () => {
      if (booting) finishBoot()
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
  }, [booting, finishBoot])

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
      const completed = completeCommand(input, cwd)
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

  const prompt = vim ? ":" : `${root ? "root" : "guest"}@pixel-peeper:${cwd}$`

  return (
    <section id="about" className="mb-0 h-full" style={{ height: "100%" }}>
      <MatrixRain active={matrix} />
      <div className="sr-only">
        Interactive portfolio shell. Type help after the boot sequence, or press any key to skip.
      </div>
      <div
        role="application"
        aria-label="Interactive about terminal"
        onClick={() => {
          if (booting) finishBoot()
          inputRef.current?.focus()
        }}
        onKeyDown={(event) => {
          if (booting && event.key !== "Tab") finishBoot()
        }}
        className={`font-mono text-sm md:text-base leading-relaxed mt-1 h-[96%] overflow-hidden relative p-3 md:p-5 bg-black/55 border border-[#333] shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] rounded flex flex-col ${isGlitching ? "glitch" : ""} ${root ? "shadow-[inset_0_0_28px_rgba(255,72,0,0.18)]" : ""}`}
      >
        <div className="flex items-center justify-between text-[11px] md:text-xs tracking-wider text-white/40 border-b border-[#333] pb-2 mb-2 shrink-0">
          <span className="text-[#00ffff]/80">{root ? "root@pixel-peeper" : "guest@pixel-peeper"} — psh</span>
          <span>{booting ? "BOOT" : vim ? "VIM" : "READY"} · ` focus</span>
        </div>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto pr-1 space-y-0.5">
          {booting ? (
            <div>
              {bootLines.map((line, index) => (
                <span key={`${bootIndex}-${index}-${line.text.length}`} className={line.isPrompt ? "text-[#ff4800]" : "text-[#00ffff]"}>
                  {line.text}
                  {index < bootLines.length - 1 ? <br /> : null}
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

          {!booting ? (
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
          ) : (
            <p className="text-white/30 text-xs mt-4">press any key to skip boot</p>
          )}
        </div>
      </div>
    </section>
  )
}
