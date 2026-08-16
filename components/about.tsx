"use client"

import { useState, useEffect, useRef } from "react"

type Command = {
  prompt: string
  output: string
}

const COMMANDS: Command[] = [
  {
    prompt: "> whoami:",
    output: "Yo, I'm @PiX3L_P33P3R, a UM6P/1337 student",
  },
  {
    prompt: "> cat motto.txt",
    output: "Jack of all trades, Master of none; Exploration of all, Not a prisoner of one.",
  },
  {
    prompt: "> cat bio.txt",
    output:
      "A hardcore passion for tech, coding, and building dope stuff! A general jack of all trades (master of some, more to come), diving into everything from gritty assembly to slick scripting. I live for tinkering with hardware and software, always chasing the next big challenge to create something epic.",
  },
  {
    prompt: "> skills",
    output: "Assembly, Python, JavaScript, C, and more in the works!",
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
  const [displayLines, setDisplayLines] = useState<{ text: string; isPrompt: boolean }[]>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (currentCommandIndex >= COMMANDS.length) {
      if (!isHovering) {
        const resetTimer = setTimeout(() => {
          setDisplayLines([])
          setCurrentCommandIndex(0)
          setCharIndex(0)
          setIsGlitching(false)
        }, 5000)
        return () => clearTimeout(resetTimer)
      }
      return
    }

    const currentCommand = COMMANDS[currentCommandIndex]
    const fullCommandText = `${currentCommand.prompt}\n${currentCommand.output}\n`

    if (charIndex === 0) {
      setIsGlitching(true)
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
      glitchTimeoutRef.current = setTimeout(() => setIsGlitching(false), 1337)
    }

    if (charIndex < fullCommandText.length) {
      const timer = setTimeout(() => {
        const currentText = fullCommandText.substring(0, charIndex + 1)
        setDisplayLines(
          currentText.split("\n").map((line, index) => ({
            text: line,
            isPrompt: index === 0 && line.startsWith(">"),
          })),
        )
        setCharIndex((prev) => prev + 1)
      }, 42)
      return () => clearTimeout(timer)
    }

    const nextCommandTimer = setTimeout(() => {
      setCurrentCommandIndex((prev) => prev + 1)
      setCharIndex(0)
    }, 500)
    return () => clearTimeout(nextCommandTimer)
  }, [charIndex, currentCommandIndex, isHovering])

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    }
  }, [])

  return (
    <section id="about" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0" style={{ height: "100%" }}>
      <div className="sr-only">{FULL_TEXT}</div>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`font-mono text-[#00ffff] text-sm md:text-xl leading-relaxed mt-4 overflow-y-auto relative p-4 md:p-7 bg-black/50 border border-[#333] shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] rounded ${isGlitching ? "glitch" : ""}`}
        aria-label="About me terminal display"
        style={{ height: "96%" }}
      >
        <div className="relative">
          {displayLines.map((line, index) => (
            <span key={`${currentCommandIndex}-${index}-${line.text.length}`} className={line.isPrompt ? "text-[#ff4800]" : undefined}>
              {line.text}
              {index < displayLines.length - 1 ? <br /> : null}
            </span>
          ))}
          <span className="text-[#ff4800] animate-blink" aria-hidden="true">
            |
          </span>
        </div>
      </div>
    </section>
  )
}
