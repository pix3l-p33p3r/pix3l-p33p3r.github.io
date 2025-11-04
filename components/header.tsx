"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { trackNavigation } from "@/lib/analytics"

export default function Header() {
  const [status, setStatus] = useState("SYSTEM STATUS: NORMAL")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (section: string) => {
    trackNavigation(section)
    setMobileMenuOpen(false)
    console.log(`📊 Analytics: Navigation to ${section} tracked`)
  }

  return (
    <header className="col-span-full flex flex-col lg:flex-row justify-between items-center border border-[#333] p-2.5 px-5 bg-[rgba(20,20,20,0.7)] shadow-md shadow-black/50 relative z-20 gap-4">
      <div className="flex w-full lg:w-auto justify-between items-center">
        <div className="text-[#ff4800] font-bold text-xl md:text-2xl flex items-center before:content-[''] before:inline-block before:w-0 before:h-0 before:border-l-[10px] before:border-r-[10px] before:border-transparent before:border-b-[20px] before:border-b-[#ff4800] before:mr-2.5 text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
          pix3l_p33p3r
        </div>

        <button
          className="lg:hidden text-[#00ffff] p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav
        className={`${mobileMenuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row items-center w-full lg:w-auto gap-2 lg:gap-0`}
        aria-label="Main navigation"
      >
        <Link
          href="#projects"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Projects")}
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Blog")}
        >
          Blog
        </Link>
        <Link
          href="#skills"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Skills")}
        >
          Skills
        </Link>
        <Link
          href="#resume"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Resume")}
        >
          Resume
        </Link>
        <Link
          href="#contact"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Contact")}
        >
          Contact
        </Link>
      </nav>
    </header>
  )
}
