"use client"

import { useState, useEffect, useRef } from "react"

export default function About() {
  const [mainIndex, setMainIndex] = useState(0)
  const [warningIndex, setWarningIndex] = useState(0)
  const ghostTextRef = useRef<HTMLParagraphElement>(null)
  const warningTextRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const mainText =
    "I'm pix3l_p33p3r, a student at UM6P/1337, passionate about tech, coding, and building things. My journey includes exploring various programming languages, tools, and technologies, from low-level assembly to high-level scripting. I enjoy tinkering with hardware and software alike, always looking for new challenges to solve."
  const warningTextContent = "WARNING: OPEN FOR HIRING!"

  useEffect(() => {
    // Update terminal date
    const updateTerminalDate = () => {
      if (!terminalRef.current) return

      const now = new Date()
      const dateString = now
        .toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/,/, "")

      terminalRef.current.setAttribute("data-time", `[${dateString}] pix3l_p33p3r@UM6P-1337`)
    }

    updateTerminalDate()
    const interval = setInterval(updateTerminalDate, 1000)

    return () => clearInterval(interval)
  }, [])

  // Type main text
  useEffect(() => {
    if (mainIndex < mainText.length) {
      const timer = setTimeout(() => {
        if (ghostTextRef.current) {
          ghostTextRef.current.textContent = mainText.substring(0, mainIndex + 1)
        }
        setMainIndex(mainIndex + 1)
      }, 30)

      return () => clearTimeout(timer)
    } else {
      // After main text finishes, start typing warning
      const timer = setTimeout(() => {
        setWarningIndex(1) // Start warning
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [mainIndex, mainText])

  // Type warning text
  useEffect(() => {
    if (warningIndex === 0) return

    if (warningIndex === 1) {
      // Make warning visible
      if (warningTextRef.current) {
        warningTextRef.current.style.opacity = "1"
      }
    }

    if (warningIndex <= warningTextContent.length) {
      const timer = setTimeout(() => {
        if (warningTextRef.current) {
          warningTextRef.current.textContent = warningTextContent.substring(0, warningIndex)
        }
        setWarningIndex(warningIndex + 1)
      }, 37)

      return () => clearTimeout(timer)
    } else {
      // Reset everything after a pause
      const timer = setTimeout(() => {
        if (ghostTextRef.current) {
          ghostTextRef.current.textContent = ""
        }
        if (warningTextRef.current) {
          warningTextRef.current.textContent = ""
          warningTextRef.current.style.opacity = "0"
        }
        setMainIndex(0)
        setWarningIndex(0)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [warningIndex, warningTextContent])

  return (
    <section id="about" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        ABOUT ME
      </h2>
      <div
        ref={terminalRef}
        className="font-mono text-[#00ffff] text-base md:text-2xl leading-relaxed mt-4 min-h-[450px] md:min-h-[700px] overflow-hidden relative p-4 md:p-7 bg-black/50 border border-[#333] shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] rounded before:content-[attr(data-time)] before:text-[#00ffff] before:text-sm md:before:text-lg before:block before:pb-2.5 before:border-b before:border-dashed before:border-[#333] before:mb-2.5"
        aria-label="About me terminal display"
      >
        <div className="flex items-start">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[#ff4800] text-2xl animate-blink -mt-0.5">&gt;</span>
            <p ref={ghostTextRef} id="ghost-text" className="m-0 inline"></p>
          </div>
        </div>
        <div
          ref={warningTextRef}
          id="warning-text"
          className="text-[#ff4800] mt-5 text-2xl uppercase relative inline-block opacity-0 font-bold tracking-wider after:content-['|'] after:text-[#ff4800] after:animate-blink-cursor"
        ></div>
      </div>
    </section>
  )
}
