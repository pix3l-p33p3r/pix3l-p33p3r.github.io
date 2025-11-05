"use client"

import { useState, useEffect, useRef } from "react"

export default function About() {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Original commands array
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
      prompt: "> skills",
      output: "Assembly, Python, JavaScript, C, and more in the works!",
    },
    {
      prompt: "> echo $STATUS",
      output: "WARNING: OPEN TO WORK!",
    },
  ]

  // Combine all text for accessibility
  const fullText = commands.map((cmd) => `${cmd.prompt} ${cmd.output}`).join(" ")

  // Typing effect
  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      if (!isHovering) {
        const resetTimer = setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.innerHTML = ""
            outputRef.current.classList.remove("glitch")
          }
          setCurrentCommandIndex(0)
          setCharIndex(0)
        }, 5000)

        return () => clearTimeout(resetTimer)
      }
      return
    }

    const currentCommand = commands[currentCommandIndex]
    const fullCommandText = `${currentCommand.prompt}\n${currentCommand.output}\n`

    if (charIndex === 0 && outputRef.current) {
      outputRef.current.classList.add("glitch")
      setTimeout(() => {
        if (outputRef.current) outputRef.current.classList.remove("glitch")
      }, 1337)
    }

    if (charIndex < fullCommandText.length) {
      const timer = setTimeout(() => {
        if (outputRef.current) {
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
      }, 42)

      return () => clearTimeout(timer)
    } else {
      const nextCommandTimer = setTimeout(() => {
        setCurrentCommandIndex(currentCommandIndex + 1)
        setCharIndex(0)
      }, 500)

      return () => clearTimeout(nextCommandTimer)
    }
  }, [charIndex, currentCommandIndex, isHovering])

  useEffect(() => {
    if (currentCommandIndex >= commands.length && !isHovering) {
      const resetTimer = setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.innerHTML = ""
          outputRef.current.classList.remove("glitch")
        }
        setCurrentCommandIndex(0)
        setCharIndex(0)
      }, 5000)

      return () => clearTimeout(resetTimer)
    }
  }, [isHovering, currentCommandIndex])

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
