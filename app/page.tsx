import Header from "@/components/header"
import Footer from "@/components/footer"
import SphereVisualization from "@/components/sphere-visualization"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
import TargetCross from "@/components/ui/target-cross"
import GridLines from "@/components/ui/grid-lines"
import FloatingElements from "@/components/ui/floating-elements"
import DataOverlay from "@/components/ui/data-overlay"

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] grid-rows-[80px_auto_auto_md:1fr_80px] md:grid-rows-[80px_1fr_80px] h-screen p-2.5 gap-2.5">
      <Header />

      <main className="col-span-1 row-span-1 relative border border-[#333] bg-[rgba(20,20,20,0.7)] flex justify-center items-center overflow-hidden shadow-inner shadow-black/50 min-h-[300px] md:min-h-0">
        <SphereVisualization />
        <TargetCross />
        <GridLines />
        <FloatingElements />
        <DataOverlay />

        {/* About section overlay */}
        <div className="absolute inset-0 z-20 items-center justify-center p-4" style={{ height: "100%" }}>
          <div className="w-full max-w-4xl" style={{ height: "100%" }}>
            <About />
          </div>
        </div>
      </main>

      <aside className="col-span-1 row-span-1 border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 overflow-hidden relative shadow-inner shadow-black/50">
        <div
          className="h-full overflow-y-auto pr-1.5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <Projects />
          <Skills />
          <Contact />
        </div>
      </aside>

      <Footer />
    </div>
  )
}
