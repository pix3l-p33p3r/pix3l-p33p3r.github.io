type BrandMarkProps = {
  className?: string
  title?: string
}

export default function BrandMark({ className, title = "pix3l_p33p3r" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" fill="#050505" />
      <rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="#333" strokeWidth="1" />
      <path d="M8 6 L16 20 L24 6" fill="none" stroke="#ff4800" strokeWidth="2" />
      <ellipse cx="16" cy="21" rx="8" ry="4.5" fill="none" stroke="#00ffff" strokeWidth="1.4" />
      <rect x="14" y="19" width="4" height="4" fill="#ff4800" />
      <rect x="15" y="20" width="2" height="2" fill="#00ffff" />
    </svg>
  )
}
