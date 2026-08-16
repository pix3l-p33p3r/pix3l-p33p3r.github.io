import Header from "@/components/header"
import Footer from "@/components/footer"
import SphereVisualization from "@/components/sphere-visualization"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
import CVSection from "@/components/cv-section"
import TargetCross from "@/components/ui/target-cross"
import GridLines from "@/components/ui/grid-lines"
import FloatingElements from "@/components/ui/floating-elements"

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_1fr_auto] md:grid-rows-[80px_minmax(0,1fr)_80px] min-h-screen md:h-screen md:min-h-0 p-2.5 gap-2.5">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative border border-[#333] bg-[rgba(20,20,20,0.7)] flex justify-center items-center overflow-hidden shadow-inner shadow-black/50 h-14 max-h-14 min-h-0 md:h-auto md:max-h-none md:col-start-1 md:row-start-2"
      >
        <div className="hidden md:block absolute inset-0">
          <SphereVisualization />
          <TargetCross />
          <GridLines />
          <FloatingElements />
        </div>

        <div className="absolute inset-0 z-20 items-center justify-center p-1.5 md:p-4" style={{ height: "100%" }}>
          <div className="w-full max-w-4xl" style={{ height: "100%" }}>
            <About />
          </div>
        </div>
      </main>

      <aside className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 overflow-hidden relative shadow-inner shadow-black/50 min-h-0 md:col-start-2 md:row-start-2">
        <div className="md:h-full md:overflow-y-auto no-scrollbar">
          <Projects />
          <Skills />
          <CVSection />
          <Contact />
        </div>
      </aside>

      <Footer />
    </div>
  )
}
