"use client"
import { trackContactClick } from "@/lib/analytics"
import { isValidUrl } from "@/lib/security"

const CONTACTS = [
  { label: "Email", href: "mailto:pix3l-p33p3r@proton.me", platform: "Email", external: false },
  { label: "GitHub", href: "https://github.com/pix3l-p33p3r", platform: "GitHub", external: true },
  { label: "X", href: "https://x.com/PiX3L_P33P3R", platform: "Twitter/X", external: true },
] as const

const rowClassName =
  "bg-black/30 border border-[#333] p-4 px-5 min-h-11 rounded-lg flex items-center transition-all duration-300 relative overflow-hidden w-full cursor-pointer before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 hover:border-[#00ffff] hover:bg-[rgba(0,255,255,0.08)] hover:translate-x-[3px] hover:shadow-md hover:before:opacity-100"

export default function Contact() {
  const handleContactClick = (platform: string, url: string) => {
    if (!isValidUrl(url)) return
    trackContactClick(platform)
  }

  return (
    <section id="contact" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        CONTACT_INTERFACE
      </h2>

      <div className="flex flex-col gap-4 w-full mb-10">
        {CONTACTS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            onClick={() => handleContactClick(item.platform, item.href)}
            className={rowClassName}
          >
            <h3 className="text-[#00ffff] text-xl tracking-wider m-0 transition-all duration-300 font-medium hover:text-[#ff4800] hover:translate-x-[5px] hover:text-shadow-[1px_1px_3px_rgba(255,72,0,0.2)]">
              {item.label}
            </h3>
          </a>
        ))}
      </div>
    </section>
  )
}
