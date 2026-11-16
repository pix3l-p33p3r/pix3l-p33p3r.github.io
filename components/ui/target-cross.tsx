export default function TargetCross() {
  return (
    <div className="crosshair absolute inset-0 z-[5] flex items-center justify-center" aria-hidden="true">
      <div className="crosshair-frame">
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-[rgba(255,72,0,0.7)]"></div>
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[rgba(255,72,0,0.7)]"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-[rgba(255,72,0,0.45)]"></div>
        <div className="absolute left-[10%] top-[10%] h-[80%] w-[80%] rounded-full border-2 border-[rgba(255,72,0,0.35)]"></div>
        <div className="absolute left-[20%] top-[20%] h-[60%] w-[60%] rounded-full border border-[rgba(255,72,0,0.25)]"></div>
        <div className="absolute right-[22%] top-[24%] h-4 w-4 rounded-full bg-[#ff4800] shadow-[0_0_5px_#ff4800]"></div>
        <div className="absolute right-[20%] top-[48%] h-4 w-4 rounded-full bg-[#ff4800] shadow-[0_0_5px_#ff4800]"></div>
      </div>
    </div>
  )
}
