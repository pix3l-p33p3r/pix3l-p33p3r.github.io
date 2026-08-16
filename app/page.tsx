import Header from "@/components/header"
import Footer from "@/components/footer"
import SphereVisualization from "@/components/sphere-visualization"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Interests from "@/components/interests"
import Contact from "@/components/contact"
import CVSection from "@/components/cv-section"
import TargetCross from "@/components/ui/target-cross"
import GridLines from "@/components/ui/grid-lines"
import FloatingElements from "@/components/ui/floating-elements"

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_minmax(220px,38vh)_auto_minmax(12rem,36vh)_auto] md:grid-rows-[80px_minmax(0,1fr)_auto_80px] min-h-screen md:h-screen p-2.5 gap-2.5">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative border border-[#333] bg-[rgba(20,20,20,0.7)] flex justify-center items-center overflow-hidden shadow-inner shadow-black/50 min-h-[220px] md:min-h-0 md:col-start-1 md:row-start-2"
      >
        <SphereVisualization />
        <TargetCross />
        <GridLines />
        <FloatingElements />
      </main>

      <div className="min-w-0 md:col-start-1 md:row-start-3">
        <About />
      </div>

      <aside className="min-h-0 border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 overflow-hidden relative shadow-inner shadow-black/50 md:col-start-2 md:row-start-2 md:row-span-2">
        <div className="h-full overflow-y-auto show-scrollbar">
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
