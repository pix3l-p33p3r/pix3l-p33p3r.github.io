export default function TargetCross() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[5] flex justify-center items-center" aria-hidden="true">
      <div className="relative w-[300px] h-[300px]">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[rgba(255,72,0,0.7)] -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-[rgba(255,72,0,0.7)] -translate-x-1/2"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-[rgba(255,72,0,0.4)] transition-all duration-500"></div>
        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full border-[2px] border-[rgba(255,72,0,0.3)] transition-all duration-500"></div>
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full border border-[rgba(255,72,0,0.2)] transition-all duration-500"></div>
      </div>
    </div>
  )
}
