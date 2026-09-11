import TrackedContactLink from "@/components/tracked-contact-link"

const footerLinkClass =
  "text-[#00ffff] transition-colors duration-200 hover:text-[#00cccc] hover:underline"

export default function Footer() {
  return (
    <footer className="col-span-full border border-[#333] bg-[rgba(20,20,20,0.7)] p-2.5 px-5 flex flex-col md:flex-row justify-between items-center text-base md:text-xl gap-2 md:gap-0">
      <p className="text-center md:text-left">
        © 2026 pix3l_p33p3r · <span className="text-[#00ffff]">vsh</span> · type{" "}
        <span className="text-[#00ffff]">help</span> · press <kbd className="text-[#ff4800]">`</kbd>
      </p>
      <div className="flex gap-4 md:gap-0">
        <TrackedContactLink
          platform="GitHub"
          href="https://github.com/pix3l-p33p3r"
          external
          className={`${footerLinkClass} md:ml-4`}
        >
          GitHub
        </TrackedContactLink>
        <TrackedContactLink
          platform="Twitter/X"
          href="https://x.com/PiX3L_P33P3R"
          external
          className={`${footerLinkClass} ml-4`}
        >
          X
        </TrackedContactLink>
        <TrackedContactLink
          platform="Email"
          href="mailto:pix3l-p33p3r@proton.me"
          className={`${footerLinkClass} ml-4`}
        >
          Email
        </TrackedContactLink>
      </div>
    </footer>
  )
}
