"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import BrandMark from "@/components/brand-mark"
import { trackNavigation } from "@/lib/analytics"

const NAV = [
  { label: "Projects", hash: "projects" },
  { label: "Skills", hash: "skills" },
  { label: "Interests", hash: "interests" },
  { label: "Resume", hash: "resume" },
  { label: "Contact", hash: "contact" },
] as const

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === "/"

  const handleNavClick = (section: string) => {
    trackNavigation(section)
    setMobileMenuOpen(false)
  }

  const sectionHref = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)

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
        {NAV.map((item) => (
          <Link
            key={item.hash}
            href={sectionHref(item.hash)}
            className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
            onClick={() => handleNavClick(item.label)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/blog"
          className="text-[#00ffff] lg:ml-5 text-lg md:text-xl relative py-1.5 hover:text-[#00cccc] hover:text-shadow-[0_0_5px_rgba(0,255,255,0.2)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00ffff] after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full w-full lg:w-auto text-center"
          onClick={() => handleNavClick("Blog")}
        >
          Blog
        </Link>
        <button
          type="button"
          className="text-[#ff4800] lg:ml-5 text-lg md:text-xl py-1.5 tracking-wider hover:text-[#00ffff] w-full lg:w-auto text-center"
          onClick={() => {
            handleNavClick("Shell")
            if (!onHome) {
              window.location.href = "/#about"
              return
            }
            window.dispatchEvent(new Event("pixel-shell-focus"))
          }}
        >
          &gt;_
        </button>
      </nav>
    </header>
  )
}
