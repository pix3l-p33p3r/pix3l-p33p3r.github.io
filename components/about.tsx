"use client"

import { useState, useEffect, useRef } from "react"

type Command = {
  prompt: string
  output: string
}

const COMMANDS: Command[] = [
  {
    prompt: "> whoami:",
    output: "Pixel Peeper // @PiX3L_P33P3R | DevSecOps | 1337/UM6P",
  },
  {
    prompt: "> cat bio.txt",
    output: "Vault + K3s. Dynamic creds, rotating PKI, GitOps. Hardened clusters, not vibes.",
  },
  {
    prompt: "> skills",
    output: "Vault · K3s · Docker · Python · C/C++ · Zig · SAST/DAST · EN fluent / FR professional / AR native",
  },
  {
    prompt: "> echo $STATUS",
    output: "WARNING: OPEN TO WORK!",
  },
]

const FULL_TEXT = COMMANDS.map((cmd) => `${cmd.prompt} ${cmd.output}`).join(" ")

export default function About() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [lines, setLines] = useState<{ text: string; isPrompt: boolean }[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentCommandIndex >= COMMANDS.length) {
      if (!isHovering) {
        const resetTimer = setTimeout(() => {
          setLines([])
          setCurrentCommandIndex(0)
          setCharIndex(0)
        }, 5000)
        return () => clearTimeout(resetTimer)
      }
      return
    }

    const currentCommand = COMMANDS[currentCommandIndex]
    const fullCommandText = `${currentCommand.prompt}\n${currentCommand.output}\n`

    if (charIndex < fullCommandText.length) {
      const timer = setTimeout(() => {
        const currentText = fullCommandText.substring(0, charIndex + 1)
        const nextLines = currentText.split("\n").map((line, index) => ({
          text: line,
          isPrompt: index === 0 && line.startsWith(">"),
        }))
        setLines(nextLines)
        setCharIndex(charIndex + 1)
      }, 42)
      return () => clearTimeout(timer)
    }

    const nextTimer = setTimeout(() => {
      setCurrentCommandIndex((prev) => prev + 1)
      setCharIndex(0)
    }, 800)
    return () => clearTimeout(nextTimer)
  }, [charIndex, currentCommandIndex, isHovering])

  return (
    <div
      ref={terminalRef}
      className="h-full flex flex-col font-mono text-sm md:text-base"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={FULL_TEXT}
    >
      <div className="border-b border-[#333] pb-2 mb-3 text-[#00ffff] tracking-wider">ABOUT_TERMINAL</div>
      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
        {lines.map((line, index) => (
          <div key={`${index}-${line.text}`} className={line.isPrompt ? "text-[#ff4800]" : "text-white/90"}>
            {line.text || "\u00A0"}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-[#00ffff] animate-blink-cursor align-middle" aria-hidden="true" />
      </div>
    </div>
  )
}
