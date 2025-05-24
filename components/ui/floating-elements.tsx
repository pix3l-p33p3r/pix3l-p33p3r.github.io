export default function FloatingElements() {
  return (
    <>
      <div
        className="floating-element absolute w-5 h-5 bg-[#ff4800] rounded-full shadow-[0_0_5px_#ff4800] z-[5] animate-float top-[100px] right-[100px]"
        aria-hidden="true"
      ></div>
      <div
        className="floating-element absolute w-5 h-5 bg-[#ff4800] rounded-full shadow-[0_0_5px_#ff4800] z-[5] animate-float animation-delay-2s top-[200px] right-[200px]"
        aria-hidden="true"
      ></div>
    </>
  )
}
