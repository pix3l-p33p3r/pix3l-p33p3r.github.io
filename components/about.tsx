"use client"

import { useState, useEffect, useRef } from "react"

export default function About() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0) // Tracks which command is being executed
  const [charIndex, setCharIndex] = useState(0) // Tracks character index for typing
  const [isHovering, setIsHovering] = useState(false) // Tracks hover state for pause
  const terminalRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Define commands and their outputs
  const commands = [
    {
      prompt: "> whoami:",
      output: "Yo, I'm @PiX3L_P33P3R, a UM6P/1337 student",
    },
    {
      prompt: "> cat bio.txt",
      output:
        "A hardcore passion for tech, coding, and building dope stuff! A general jack of all trades (master of some, more to come), diving into everything from gritty assembly to slick scripting. I live for tinkering with hardware and software, always chasing the next big challenge to create something epic.",
    },
    {
      prompt: "> echo $STATUS",
      output: "WARNING: OPEN FOR HIRING!",
    },
  ]

  // Combine all text for accessibility
  const fullText = commands.map((cmd) => `${cmd.prompt} ${cmd.output}`).join(" ")

  // Initialize typing sound (base64-encoded WAV for simplicity)
  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=")
    audioRef.current.volume = 0.2 // Lower volume to avoid being jarring
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  // Typing effect
  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      // All commands done, reset after 5 seconds unless hovering
      if (!isHovering) {
        const resetTimer = setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.innerHTML = ""
            outputRef.current.classList.remove("glitch")
          }
          setCurrentCommandIndex(0)
          setCharIndex(0)
        }, 5000) // Tweak this delay (ms) for reset timing

        return () => clearTimeout(resetTimer)
      }
      return
    }

    const currentCommand = commands[currentCommandIndex]
    const fullCommandText = `${currentCommand.prompt}\n${currentCommand.output}\n`

    if (charIndex === 0 && outputRef.current) {
      // Add glitch effect at start of each command
      outputRef.current.classList.add("glitch")
      setTimeout(() => {
        if (outputRef.current) outputRef.current.classList.remove("glitch")
      }, 300) // Glitch lasts 300ms
    }

    if (charIndex < fullCommandText.length) {
      const timer = setTimeout(() => {
        if (outputRef.current) {
          // Play typing sound
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {}) // Handle autoplay restrictions
          }
          // Render text
          const currentText = fullCommandText.substring(0, charIndex + 1)
          const lines = currentText.split("\n")
          const html = lines
            .map((line, index) => {
              if (index === 0 && line.startsWith(">")) {
                return `<span class="text-[#ff4800]">${line}</span>`
              }
              return `<span>${line}</span>`
            })
            .join("<br>")
          outputRef.current.innerHTML = html
        }
        setCharIndex(charIndex + 1)
      }, 30) // Tweak this delay (ms) for typing speed

      return () => clearTimeout(timer)
    } else {
      // Move to next command after 500ms pause
      const nextCommandTimer = setTimeout(() => {
        setCurrentCommandIndex(currentCommandIndex + 1)
        setCharIndex(0)
      }, 500) // Tweak this delay (ms) for pause between commands

      return () => clearTimeout(nextCommandTimer)
    }
  }, [charIndex, currentCommandIndex, isHovering])

  return (
    <section
      id="about"
      className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0"
      style={{ height: "100%" }}
    >
      <div className="sr-only">{fullText}</div>
      <div
        ref={terminalRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="font-mono text-[#00ffff] text-sm md:text-xl leading-relaxed mt-4 overflow-hidden relative p-4 md:p-7 bg-black/50 border border-[#333] shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] rounded"
        aria-label="About me terminal display"
        style={{ height: "96%" }}
      >
        <div ref={outputRef} className="relative after:content-['|'] after:text-[#ff4800] after:animate-blink"></div>
      </div>
    </section>
  )
}
