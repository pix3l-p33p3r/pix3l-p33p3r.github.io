"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import BrandMark from "@/components/brand-mark"
import { trackNavigation } from "@/lib/analytics"

const navLinkClass =
  "text-[#00ffff] lg:ms-5 text-lg md:text-xl relative inline-flex items-center justify-center min-h-11 py-2 hover:text-[#00cccc] active:text-[#ff4800] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#00ffff] after:transition-transform after:duration-150 after:ease-out hover:after:scale-x-100 w-full lg:w-auto text-center"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === "/"
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/")

  const handleNavClick = (section: string) => {
    trackNavigation(section)
    setMobileMenuOpen(false)
  }

  return (
    <header className="col-span-full flex flex-col lg:flex-row justify-between items-center border border-[#333] p-3 px-5 bg-[rgba(20,20,20,0.7)] relative z-20 gap-4">
      <div className="flex w-full lg:w-auto justify-between items-center">
        {onHome ? (
          <h1 className="m-0 text-xl md:text-2xl font-bold">
            <Link
              href="/"
              className="text-[#ff4800] font-bold text-xl md:text-2xl flex items-center gap-2 text-shadow-[0_0_5px_rgba(255,72,0,0.2)] no-underline"
              aria-current="page"
              onClick={() => handleNavClick("Home")}
            >
              <BrandMark decorative className="w-8 h-8 shrink-0 border border-[#333]" />
              <span>pix3l_p33p3r</span>
            </Link>
          </h1>
        ) : (
          <Link
            href="/"
            className="text-[#ff4800] font-bold text-xl md:text-2xl flex items-center gap-2 text-shadow-[0_0_5px_rgba(255,72,0,0.2)] no-underline min-h-11"
            onClick={() => handleNavClick("Home")}
          >
            <BrandMark decorative className="w-8 h-8 shrink-0 border border-[#333]" />
            <span>pix3l_p33p3r</span>
          </Link>
        )}

        <button
          type="button"
          className="lg:hidden text-[#00ffff] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-nav"
        >
          <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <nav
        id="site-nav"
        className={`${mobileMenuOpen ? "flex" : "max-lg:hidden"} flex flex-col lg:flex-row items-center w-full lg:w-auto gap-2 lg:gap-0 bg-black/90 lg:bg-transparent p-2 lg:p-0`}
        aria-label="Main navigation"
      >
        <Link href="/#projects" className={navLinkClass} onClick={() => handleNavClick("Projects")}>
          Projects
        </Link>
        <Link
          href="/blog"
          className={`${navLinkClass} ${onBlog ? "after:scale-x-100" : ""}`}
          aria-current={onBlog ? "page" : undefined}
          onClick={() => handleNavClick("Blog")}
        >
          Blog
        </Link>
        <Link href="/#skills" className={navLinkClass} onClick={() => handleNavClick("Skills")}>
          Skills
        </Link>
        <Link href="/#interests" className={navLinkClass} onClick={() => handleNavClick("Interests")}>
          Interests
        </Link>
        <Link href="/#resume" className={navLinkClass} onClick={() => handleNavClick("Resume")}>
          Resume
        </Link>
        <Link href="/#contact" className={navLinkClass} onClick={() => handleNavClick("Contact")}>
          Contact
        </Link>
        <button
          type="button"
          aria-label="Focus shell"
          className="text-[#ff4800] lg:ms-5 text-lg md:text-xl tracking-wider hover:text-[#00ffff] active:text-[#00ffff] inline-flex items-center justify-center min-h-11 min-w-11 w-full lg:w-auto text-center"
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
