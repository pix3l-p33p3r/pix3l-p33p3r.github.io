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
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-[auto_minmax(300px,1fr)_auto_auto] md:grid-rows-[80px_1fr_80px] h-screen p-2.5 gap-2.5">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="col-span-1 row-span-1 relative border border-[#333] bg-[rgba(20,20,20,0.7)] flex justify-center items-center overflow-hidden shadow-inner shadow-black/50 min-h-[300px] md:min-h-0"
      >
        <SphereVisualization />
        <TargetCross />
        <GridLines />
        <FloatingElements />

        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 md:p-4 pointer-events-none">
          <div className="w-full max-w-xl pointer-events-auto">
            <About />
          </div>
        </div>
      </main>

      <aside className="col-span-1 row-span-1 border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 overflow-hidden relative shadow-inner shadow-black/50">
        <div className="h-full overflow-y-auto no-scrollbar">
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
