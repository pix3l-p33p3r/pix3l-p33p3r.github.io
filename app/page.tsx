import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SphereGate from "@/components/sphere-gate"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Interests from "@/components/interests"
import Contact from "@/components/contact"
import CVSection from "@/components/cv-section"
import TargetCross from "@/components/ui/target-cross"
import GridLines from "@/components/ui/grid-lines"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
}

export default function Home() {
  return (
    <div className="home-shell">
      <Header />

      <main id="main-content" tabIndex={-1} className="hero-pane">
        <div className="sphere-stage">
          <SphereGate />
          <TargetCross />
          <GridLines />
        </div>
        <div className="terminal-layer">
          <About />
        </div>
      </main>

      <aside className="side-pane">
        <div className="side-pane-scroll">
          <Projects />
          <Skills />
          <Interests />
          <CVSection />
          <Contact />
        </div>
      </aside>

      <Footer />
    </div>
  )
}
