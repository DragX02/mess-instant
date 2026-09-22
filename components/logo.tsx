import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  withText?: boolean
  full?: boolean
}

export function Logo({
  href = "/",
  size = "md",
  className = "",
  withText = false,
  full = false,
}: LogoProps) {
  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 40, height: 40 },
    lg: { width: 56, height: 56 },
    xl: { width: 96, height: 96 },
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const { width, height } = iconSizes[size]

  const icon = (
    <Image
      src="/apple-touch-icon.png"
      alt="Helix"
      width={width}
      height={height}
      className="rounded-lg"
      priority
    />
  )

  const fullLogo = (
    <Image
      src="/logo-full.png"
      alt="Helix - Messagerie B2B"
      width={300}
      height={120}
      className="h-auto w-auto"
      priority
    />
  )

  const content = full ? (
    <div className={className}>{fullLogo}</div>
  ) : withText ? (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon}
      <span className={`font-bold font-sans text-primary ${textSizes[size]}`}>Helix</span>
    </div>
  ) : (
    <div className={className}>{icon}</div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
