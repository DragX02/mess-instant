import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

const iconSizes = {
  sm: 24,
  md: 40,
  lg: 56,
  xl: 96,
}

const textSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
}

export function Logo({
  href = "/",
  size = "md",
  className,
  withText = false,
  full = false,
}: {
  href?: string
  size?: keyof typeof iconSizes
  className?: string
  withText?: boolean
  full?: boolean
}) {
  const side = iconSizes[size]

  const icon = (
    <Image
      src="/apple-touch-icon.png"
      alt="Helix"
      width={side}
      height={side}
      className="rounded-lg"
      priority
    />
  )

  let content = <div className={className}>{icon}</div>

  if (full) {
    content = (
      <div className={className}>
        <Image
          src="/logo-full.png"
          alt="Helix - Messagerie B2B"
          width={300}
          height={120}
          className="h-auto w-auto"
          priority
        />
      </div>
    )
  } else if (withText) {
    content = (
      <div className={cn("flex items-center gap-2", className)}>
        {icon}
        <span className={cn("font-bold font-sans text-primary", textSizes[size])}>Helix</span>
      </div>
    )
  }

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="inline-flex hover:opacity-80 transition-opacity">
      {content}
    </Link>
  )
}
