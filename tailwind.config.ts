import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#00cccc",
        "secondary-dark": "#cc3700",
        "bg-dark": "#000000",
        "bg-panel": "rgba(20, 20, 20, 0.7)",
        "text-muted": "#aaaaaa",
        panel: "#333333",
        "glow-primary": "rgba(0, 255, 255, 0.2)",
        "glow-secondary": "rgba(255, 72, 0, 0.2)",
      },
      animation: {
        scanline: "scanline 10s linear infinite",
        flicker: "flicker 5s infinite",
        blink: "blink 2s infinite",
        glitch: "glitch 1s linear infinite",
        "glitch-text": "glitch-text 2s infinite",
        float: "float 5s infinite ease-in-out",
        "blink-cursor": "blink-cursor 0.5s step-end infinite",
        slideIn: "slideIn 0.3s ease-out",
      },
      fontFamily: {
        "share-tech": ["Share Tech Mono", "monospace"],
        mono: ["Share Tech Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
