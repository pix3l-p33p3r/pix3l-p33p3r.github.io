"use client"

import type React from "react"

import { useState } from "react"

export default function Contact() {
  const [formStatus, setFormStatus] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const submitBtn = form.querySelector(".submit-btn") as HTMLButtonElement
    const originalText = submitBtn.innerHTML

    try {
      submitBtn.innerHTML = `
        <span class="btn-text">TRANSMITTING...</span>
        <div class="transmission-animation"></div>
      `
      submitBtn.disabled = true

      // Simulate transmission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add your actual form submission logic here

      // Show success feedback
      showNotification("TRANSMISSION_SUCCESSFUL", "success")
      form.reset()
    } catch (error) {
      showNotification("TRANSMISSION_FAILED", "error")
    } finally {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setFormStatus({ message, type })

    setTimeout(() => {
      setFormStatus(null)
    }, 3000)
  }

  return (
    <section id="contact" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-4 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        CONTACT_INTERFACE
      </h2>

      <div className="flex flex-col gap-4 w-full mb-10">
        <a
          href="mailto:pix3l-p33p3r@proton.me"
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
        </a>

        <a
          href="https://github.com/pix3l-p33p3r"
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
        </a>

        <a
          href="https://x.com/PiX3L_P33P3R"
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
        </a>
      </div>

      <div className="relative mt-10 pt-8 border-t border-dashed border-[#333] before:content-[''] before:absolute before:top-[-1px] before:left-0 before:w-[100px] before:h-px before:bg-[#00ffff] before:opacity-70">
        <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <label
              htmlFor="name"
              className="block text-[#00ffff] mb-2.5 text-base tracking-wider transition-all duration-300 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#00ffff] before:[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] before:transition-all before:duration-300 hover:text-[#ff4800] hover:before:rotate-45 hover:before:bg-[#ff4800]"
            >
              IDENTIFIER
            </label>
            <div className="relative border border-[#333] rounded bg-black/30 transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[#00ffff] before:via-transparent before:to-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none before:rounded hover:border-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] focus-within:before:opacity-20 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[#00ffff] after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 after:animate-scanline focus-within:after:opacity-50">
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-transparent border-none text-white py-3 px-4 font-mono text-base transition-all duration-300 relative z-[1] focus:text-[#00ffff] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="email"
              className="block text-[#00ffff] mb-2.5 text-base tracking-wider transition-all duration-300 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#00ffff] before:[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] before:transition-all before:duration-300 hover:text-[#ff4800] hover:before:rotate-45 hover:before:bg-[#ff4800]"
            >
              COMM_CHANNEL
            </label>
            <div className="relative border border-[#333] rounded bg-black/30 transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[#00ffff] before:via-transparent before:to-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none before:rounded hover:border-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] focus-within:before:opacity-20 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[#00ffff] after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 after:animate-scanline focus-within:after:opacity-50">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-transparent border-none text-white py-3 px-4 font-mono text-base transition-all duration-300 relative z-[1] focus:text-[#00ffff] focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="message"
              className="block text-[#00ffff] mb-2.5 text-base tracking-wider transition-all duration-300 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#00ffff] before:[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] before:transition-all before:duration-300 hover:text-[#ff4800] hover:before:rotate-45 hover:before:bg-[#ff4800]"
            >
              DATA_PACKET
            </label>
            <div className="relative border border-[#333] rounded bg-black/30 transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[#00ffff] before:via-transparent before:to-[#00ffff] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none before:rounded hover:border-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] focus-within:before:opacity-20 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[#00ffff] after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 after:animate-scanline focus-within:after:opacity-50">
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full bg-transparent border-none text-white py-3 px-4 font-mono text-base transition-all duration-300 relative z-[1] focus:text-[#00ffff] focus:outline-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn w-full bg-black/30 border border-[#00ffff] text-[#00ffff] py-4 px-5 text-lg tracking-wider cursor-pointer flex items-center justify-center gap-4 transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(0,255,255,0.2)] before:to-transparent before:transition-left before:duration-500 hover:bg-[rgba(0,255,255,0.1)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,255,255,0.1)] hover:before:left-[100%]"
          >
            <span className="btn-text relative z-[1]">INITIALIZE_TRANSMISSION</span>
            <span className="btn-icon relative z-[1] transition-transform duration-300 group-hover:translate-x-[5px]">
              →
            </span>
          </button>
        </form>

        {formStatus && (
          <div
            className={`fixed top-5 right-5 p-4 px-6 rounded bg-black/80 border ${formStatus.type === "success" ? "border-[#00ff00]" : "border-[#ff0000]"} text-white z-[1000] animate-slideIn`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`w-5 h-5 rounded-full ${formStatus.type === "success" ? "bg-[#00ff00]" : "bg-[#ff0000]"} flex items-center justify-center text-black font-bold`}
              >
                !
              </span>
              <span className="notification-text">{formStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
