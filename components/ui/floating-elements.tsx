export default function FloatingElements() {
  return (
    <>
      <div
        className="floating-element absolute w-4 h-4 bg-[#ff4800] rounded-full shadow-[0_0_5px_#ff4800] z-[5] top-24 inset-inline-end-24"
        aria-hidden="true"
      ></div>
      <div
        className="floating-element absolute w-4 h-4 bg-[#ff4800] rounded-full shadow-[0_0_5px_#ff4800] z-[5] top-48 inset-inline-end-48"
        aria-hidden="true"
      ></div>
    </>
  )
}
