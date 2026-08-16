"use client"

import { useEffect } from "react"

const TRAIN = [
  "      ====        ________                ___________",
  "  _D _|  |_______/        \\__I_I_____===__|_________|",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
  "   /     |  |   H  |  |     |   |         ||_| |_||  ",
  "  |      |  |   H  |__--------------------| [___] |  ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__",
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/       ",
  "  \\_/      \\O=====O=====O=====O_/      \\_/           ",
]

export default function SteamLocomotive({ active, onDone }: { active: boolean; onDone: () => void }) {
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(onDone, 6500)
    return () => clearTimeout(timer)
  }, [active, onDone])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden" aria-hidden="true">
      <pre className="absolute top-1/3 whitespace-pre text-[#ff4800] text-[10px] md:text-xs leading-tight drop-shadow-[0_0_8px_rgba(255,72,0,0.6)] animate-sl">
        {TRAIN.join("\n")}
      </pre>
    </div>
  )
}
