import { cn } from "cn"

const VARIANTS = {
  me: {
    gradient: "user-star-me",
    stops: ["#fffbe8", "#ffd166", "#df6035"],
    glow: "drop-shadow-[0_0_10px_rgba(255,200,90,0.85)]",
    label: "text-xs font-medium text-amber-100",
  },
  other: {
    gradient: "user-star-other",
    stops: ["#ffffff", "#cfe0ff", "#7399bf"],
    glow: "drop-shadow-[0_0_6px_rgba(190,215,255,0.8)]",
    label: "text-[10px] text-white/60",
  },
}

export function UserStar({
  name,
  size = 44,
  variant = "me",
  showName = true,
  className,
}: {
  name: string
  size?: number
  variant?: keyof typeof VARIANTS
  showName?: boolean
  className?: string
}) {
  const style = VARIANTS[variant]

  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-1", className)}>
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn("animate-twinkle", style.glow)}
      >
        <defs>
          <radialGradient id={style.gradient} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor={style.stops[0]} />
            <stop offset="55%" stopColor={style.stops[1]} />
            <stop offset="100%" stopColor={style.stops[2]} />
          </radialGradient>
        </defs>
        <path
          fill={`url(#${style.gradient})`}
          d="M12 1.8l2.9 6.6 7.2.6-5.5 4.8 1.7 7-6.3-3.8-6.3 3.8 1.7-7L1.9 9l7.2-.6z"
        />
      </svg>
      {showName && <span className={cn("max-w-24 truncate", style.label)}>{name}</span>}
    </div>
  )
}
