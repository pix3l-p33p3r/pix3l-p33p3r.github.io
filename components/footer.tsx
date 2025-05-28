import Link from "next/link"

export default function Footer() {
  return (
    <footer className="col-span-full row-start-5 md:row-start-3 border border-[#333] bg-[rgba(20,20,20,0.7)] p-2.5 px-5 flex flex-col md:flex-row justify-between items-center text-base md:text-xl gap-2 md:gap-0">
      <p className="text-center md:text-left">© 2025 pix3l_p33p3r. All rights pixelated no cap.</p>
      <div className="flex gap-4 md:gap-0">
        <Link
          href="https://github.com/pix3l-p33p3r"
          className="text-[#00ffff] md:ml-4 transition-colors duration-200 hover:text-[#00cccc] hover:underline"
        >
          GitHub
        </Link>
        <Link
          href="https://x.com/PiX3L_P33P3R"
          className="text-[#00ffff] ml-4 transition-colors duration-200 hover:text-[#00cccc] hover:underline"
        >
          X
        </Link>
        <Link
          href="mailto:pix3l-p33p3r@proton.me"
          className="text-[#00ffff] ml-4 transition-colors duration-200 hover:text-[#00cccc] hover:underline"
        >
          Email
        </Link>
      </div>
    </footer>
  )
}
