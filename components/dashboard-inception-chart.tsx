import {
  formatMoney,
  formatWeekdayDate,
  inceptionMarkLabel,
  type BakedInceptionPoint,
} from "@/lib/dashboard"

type Props = {
  points: BakedInceptionPoint[]
  currency: string
}

const WIDTH = 640
const HEIGHT = 220
const PAD = { left: 58, right: 18, top: 18, bottom: 40 }

export default function DashboardInceptionChart({ points, currency }: Props) {
  if (points.length === 0) {
    return (
      <div className="border border-dashed border-[#333] bg-black/40 p-6 min-h-[220px] flex flex-col justify-center">
        <p className="text-[#00ffff] tracking-wider mb-2">Weekday inception</p>
        <p className="text-white/70">
          No weekday closes published. The curve only accepts Mon–Fri sessions — weekend calendar days are not plotted.
        </p>
      </div>
    )
  }

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const closes = points.map((point) => point.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const span = max - min || Math.max(Math.abs(max) * 0.04, 1)
  const yMin = min - span * 0.12
  const yMax = max + span * 0.12
  const yRange = yMax - yMin

  const xAt = (index: number) =>
    PAD.left + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW)
  const yAt = (value: number) => PAD.top + (1 - (value - yMin) / yRange) * innerH

  const coords = points.map((point, index) => ({
    x: xAt(index),
    y: yAt(point.close),
    point,
  }))
  const line = coords.map((row) => `${row.x.toFixed(1)},${row.y.toFixed(1)}`).join(" ")
  const ticks = [yMax, (yMin + yMax) / 2, yMin]
  const labelIndexes =
    points.length <= 5
      ? points.map((_, index) => index)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1]

  return (
    <figure className="border border-[#333] bg-black/40 p-3">
      <figcaption className="text-[#00ffff] tracking-wider mb-2">
        Weekday inception · prior closes baked · today is the live mark when present
      </figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Weekday-only equity inception chart"
        className="w-full h-auto"
      >
        <title>Weekday inception curve</title>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="rgba(0,0,0,0.35)" />
        {ticks.map((tick) => {
          const y = yAt(tick)
          return (
            <g key={`tick-${tick}`}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="#333"
                strokeDasharray="4 4"
              />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="#aaaaaa" fontSize="11">
                {formatMoney(tick, currency)}
              </text>
            </g>
          )
        })}
        {coords.length > 1 ? (
          <polyline fill="none" stroke="#00ffff" strokeWidth="2" points={line} />
        ) : null}
        {coords.map((row) => {
          const live = row.point.mark === "live_mark"
          return (
            <g key={row.point.date}>
              <circle
                cx={row.x}
                cy={row.y}
                r={live ? 6 : 3.5}
                fill={live ? "#ff4800" : "#00ffff"}
                stroke={live ? "#ff4800" : "#00ffff"}
              />
              <title>
                {`${formatWeekdayDate(row.point.date)} · ${inceptionMarkLabel(row.point.mark)} · ${formatMoney(row.point.close, currency)}`}
              </title>
            </g>
          )
        })}
        {labelIndexes.map((index) => {
          const row = coords[index]
          if (!row) return null
          return (
            <text
              key={`label-${row.point.date}`}
              x={row.x}
              y={HEIGHT - 12}
              textAnchor="middle"
              fill="#aaaaaa"
              fontSize="11"
            >
              {row.point.date.slice(5)}
            </text>
          )
        })}
      </svg>
      <p className="text-white/50 text-sm mt-2">
        X-axis is weekday index, not calendar time. Friday then Monday sit next to each other — no weekend span.
      </p>
    </figure>
  )
}
