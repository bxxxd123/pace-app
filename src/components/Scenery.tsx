import './Scenery.css'

export type SceneryVariant = 'night' | 'morning' | 'midnight'

/** 情境背景層：絕對定位鋪滿父層（父層需 position:relative + overflow:hidden） */
export default function Scenery({ variant }: { variant: SceneryVariant }) {
  return (
    <div className={`scenery scenery-${variant}`} aria-hidden>
      {variant === 'night' && (
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {/* 月亮 */}
          <circle cx="316" cy="128" r="42" fill="var(--lavender)" opacity="0.9" />
          <circle cx="300" cy="116" r="10" fill="var(--night-top)" opacity="0.25" />
          <circle cx="330" cy="142" r="7" fill="var(--night-top)" opacity="0.2" />
          {/* 星星 */}
          <Star x={60} y={96} s={1} />
          <Star x={140} y={180} s={0.7} />
          <Star x={252} y={70} s={0.8} />
          {/* 圓雲 */}
          <Cloud x={-30} y={230} scale={1.1} tone="rgba(191,166,212,0.14)" />
          <Cloud x={250} y={320} scale={0.8} tone="rgba(91,194,214,0.10)" />
        </svg>
      )}
      {variant === 'morning' && (
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {/* 晨光太陽弧 */}
          <circle cx="322" cy="120" r="58" fill="#F6C98F" opacity="0.85" />
          <circle cx="322" cy="120" r="82" fill="#F6C98F" opacity="0.25" />
          <Cloud x={-20} y={170} scale={1} tone="rgba(255,255,255,0.85)" />
          <Cloud x={230} y={280} scale={0.7} tone="rgba(255,255,255,0.65)" />
          <Cloud x={90} y={90} scale={0.55} tone="rgba(255,255,255,0.7)" />
        </svg>
      )}
      {variant === 'midnight' && (
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {/* 細月牙 */}
          <path
            d="M330 96 a40 40 0 1 0 26 70 a33 33 0 1 1 -26 -70Z"
            fill="var(--lavender)"
            opacity="0.65"
          />
          <Star x={80} y={140} s={0.6} dim />
          <Star x={210} y={90} s={0.5} dim />
        </svg>
      )}
    </div>
  )
}

function Star({ x, y, s, dim }: { x: number; y: number; s: number; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="scenery-star">
      <path
        d="M0 -12 C2 -4 4 -2 12 0 C4 2 2 4 0 12 C-2 4 -4 2 -12 0 C-4 -2 -2 -4 0 -12Z"
        fill="var(--lake)"
        opacity={dim ? 0.35 : 0.8}
      />
    </g>
  )
}

function Cloud({ x, y, scale, tone }: { x: number; y: number; scale: number; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={tone}>
      <ellipse cx="70" cy="30" rx="70" ry="26" />
      <circle cx="50" cy="12" r="26" />
      <circle cx="95" cy="8" r="20" />
    </g>
  )
}
