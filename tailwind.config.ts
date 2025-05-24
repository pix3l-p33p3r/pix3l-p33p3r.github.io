import type { Config } from "tailwind/types"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: "#00ffff",
        "primary-dark": "#00cccc",
        secondary: "#ff4800",
        "secondary-dark": "#cc3700",
        "bg-dark": "#000000",
        "bg-panel": "rgba(20, 20, 20, 0.7)",
        text: "#ffffff",
        "text-muted": "#aaaaaa",
        border: "#333333",
        "glow-primary": "rgba(0, 255, 255, 0.2)",
        "glow-secondary": "rgba(255, 72, 0, 0.2)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        scanline: "scanline 10s linear infinite",
        flicker: "flicker 5s infinite",
        blink: "blink 2s infinite",
        glitch: "glitch 1s linear infinite",
        "glitch-text": "glitch-text 2s infinite",
        float: "float 5s infinite ease-in-out",
        "blink-cursor": "blink-cursor 0.5s step-end infinite",
        pulse: "pulse 2s infinite",
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
