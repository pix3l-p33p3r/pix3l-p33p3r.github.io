"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

export default function Header() {
  const [status, setStatus] = useState("SYSTEM STATUS: NORMAL")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="col-span-full flex flex-col md:flex-row justify-between items-center border border-[#333] p-2.5 px-5 bg-[rgba(20,20,20,0.7)] shadow-md shadow-black/50 relative z-20">
      <div className="flex w-full md:w-auto justify-between items-center">
        <div className="text-[#ff4800] font-bold text-xl md:text-2xl flex items-center before:content-[''] before:inline-block before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px] before:border-transparent before:border-b-[20px] before:border-b-[#ff4800] before:mr-2.5 text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
          pix3l_p33p3r
        </div>

        <button
          className="md:hidden text-[#00ffff] p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className="text-[#00ffff] text-lg md:text-2xl animate-blink py-1 px-2 border border-[#00ffff] rounded bg-[rgba(0,255,255,0.05)] my-2 md:my-0 w-full md:w-auto text-center"
        aria-live="polite"
      >
        {status}
      </div>

      <nav
        className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center w-full md:w-auto`}
        aria-label="Main navigation"
      >
        <Link
          href="#about"
          className="text-[#00ffff] md:ml-5 text-lg md:text-2xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full md:w-auto text-center my-1 md:my-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="#projects"
          className="text-[#00ffff] md:ml-5 text-lg md:text-2xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full md:w-auto text-center my-1 md:my-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          Projects
        </Link>
        <Link
          href="#skills"
          className="text-[#00ffff] md:ml-5 text-lg md:text-2xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full md:w-auto text-center my-1 md:my-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          Skills
        </Link>
        <Link
          href="#contact"
          className="text-[#00ffff] md:ml-5 text-lg md:text-2xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full md:w-auto text-center my-1 md:my-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </Link>
      </nav>
    </header>
  )
}
