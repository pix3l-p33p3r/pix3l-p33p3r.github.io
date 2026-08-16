"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import BrandMark from "@/components/brand-mark"
import { trackNavigation } from "@/lib/analytics"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (section: string) => {
    trackNavigation(section)
    setMobileMenuOpen(false)
  }

  return (
    <header className="col-span-full flex flex-col lg:flex-row justify-between items-center border border-[#333] p-2.5 px-5 bg-[rgba(20,20,20,0.7)] shadow-md shadow-black/50 relative z-20 gap-4">
      <div className="flex w-full lg:w-auto justify-between items-center">
        <Link
          href="/"
          className="text-[#ff4800] font-bold text-xl md:text-2xl flex items-center gap-2.5 text-shadow-[0_0_5px_rgba(255,72,0,0.2)] no-underline"
          onClick={() => handleNavClick("Home")}
        >
          <BrandMark className="w-8 h-8 shrink-0 border border-[#333]" />
          <span>pix3l_p33p3r</span>
        </Link>

        <button
          type="button"
          className="lg:hidden text-[#00ffff] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-nav"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav
        id="site-nav"
        className={`${mobileMenuOpen ? "flex" : "max-lg:hidden"} flex flex-col lg:flex-row items-center w-full lg:w-auto gap-2 lg:gap-0 bg-black/90 lg:bg-transparent p-2 lg:p-0`}
        aria-label="Main navigation"
      >
        <Link
          href="/#projects"
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
          href="/#skills"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Skills")}
        >
          Skills
        </Link>
        <Link
          href="/#interests"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Interests")}
        >
          Interests
        </Link>
        <Link
          href="/#resume"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Resume")}
        >
          Resume
        </Link>
        <Link
          href="/#contact"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Contact")}
        >
          Contact
        </Link>
        <button
          type="button"
          className="text-[#ff4800] lg:ml-5 text-lg md:text-xl py-1.5 tracking-wider hover:text-[#00ffff] w-full lg:w-auto text-center"
          onClick={() => {
            handleNavClick("Shell")
            window.dispatchEvent(new Event("pixel-shell-focus"))
          }}
        >
          &gt;_
        </button>
      </nav>
    </header>
  )
}
