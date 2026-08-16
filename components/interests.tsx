const topics = ["ZK", "PQC", "OSINT", "Side-channels"]

export default function Interests() {
  return (
    <section id="interests" className="mb-8 pb-5 border-b border-dashed border-[#333] last:border-b-0">
      <h2 className="text-[#ff4800] mb-5 border-b border-[#ff4800] pb-1.5 text-2xl tracking-wider text-shadow-[0_0_5px_rgba(255,72,0,0.2)]">
        INTERESTS
      </h2>
      <p className="font-mono text-sm text-white/90 tracking-wide m-0">{topics.join(" · ")}</p>
    </section>
  )
}
