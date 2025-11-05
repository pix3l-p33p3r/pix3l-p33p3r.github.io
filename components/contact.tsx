"use client"
import { trackContactClick } from "@/lib/analytics"
import { isValidUrl } from "@/lib/security"

export default function Contact() {
  const handleContactClick = (platform: string, url: string) => {
    if (!isValidUrl(url)) {
      console.error("[v0] Invalid URL detected, blocking navigation")
      return
    }

    // Track the click
    trackContactClick(platform)
    console.log(`Analytics: ${platform} contact click tracked`)

    // Open the link with security attributes
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="contact" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        CONTACT_INTERFACE
      </h2>

      <div className="flex flex-col gap-4 w-full mb-10">
        <button
          onClick={() => handleContactClick("Email", "mailto:pix3l-p33p3r@proton.me")}
          className="bg-black/30 border border-[#333] p-4 px-5 rounded-lg flex items-center transition-all duration-300 relative overflow-hidden w-full cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 hover:border-[#00ffff] hover:bg-[rgba(0,255,255,0.08)] hover:translate-x-[3px] hover:shadow-md hover:before:opacity-100"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <h3 className="text-[#00ffff] text-xl tracking-wider m-0 transition-all duration-300 font-medium hover:text-[#ff4800] hover:translate-x-[5px] hover:text-shadow-[1px_1px_3px_rgba(255,72,0,0.2)]">
              Email
            </h3>
            <div className="flex items-center gap-2 text-[#aaa] text-sm">
              <span className="w-2 h-2 rounded-full bg-[#00cc00] shadow-[0_0_6px_rgba(0,204,0,0.4)] relative flex-shrink-0 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:bg-inherit after:animate-pulse"></span>
              SECURE
            </div>
          </div>
        </button>

        <button
          onClick={() => handleContactClick("GitHub", "https://github.com/pix3l-p33p3r")}
          className="bg-black/30 border border-[#333] p-4 px-5 rounded-lg flex items-center transition-all duration-300 relative overflow-hidden w-full cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 hover:border-[#00ffff] hover:bg-[rgba(0,255,255,0.08)] hover:translate-x-[3px] hover:shadow-md hover:before:opacity-100"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <h3 className="text-[#00ffff] text-xl tracking-wider m-0 transition-all duration-300 font-medium hover:text-[#ff4800] hover:translate-x-[5px] hover:text-shadow-[1px_1px_3px_rgba(255,72,0,0.2)]">
              GitHub
            </h3>
            <div className="flex items-center gap-2 text-[#aaa] text-sm">
              <span className="w-2 h-2 rounded-full bg-[#00ffff] shadow-[0_0_6px_rgba(0,255,255,0.4)] relative flex-shrink-0 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:bg-inherit after:animate-pulse"></span>
              ACTIVE
            </div>
          </div>
        </button>

        <button
          onClick={() => handleContactClick("Twitter/X", "https://x.com/PiX3L_P33P3R")}
          className="bg-black/30 border border-[#333] p-4 px-5 rounded-lg flex items-center transition-all duration-300 relative overflow-hidden w-full cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 hover:border-[#00ffff] hover:bg-[rgba(0,255,255,0.08)] hover:translate-x-[3px] hover:shadow-md hover:before:opacity-100"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <h3 className="text-[#00ffff] text-xl tracking-wider m-0 transition-all duration-300 font-medium hover:text-[#ff4800] hover:translate-x-[5px] hover:text-shadow-[1px_1px_3px_rgba(255,72,0,0.2)]">
              X
            </h3>
            <div className="flex items-center gap-2 text-[#aaa] text-sm">
              <span className="w-2 h-2 rounded-full bg-[#ff4800] shadow-[0_0_6px_rgba(255,72,0,0.4)] relative flex-shrink-0 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-full after:rounded-full after:bg-inherit after:animate-pulse"></span>
              ONLINE
            </div>
          </div>
        </button>
      </div>
    </section>
  )
}
