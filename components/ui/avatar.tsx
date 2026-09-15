import { cn } from "cn"

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-9 w-9 text-sm",
}

const tones = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
}

/** Pastille ronde affichant l'initiale d'une personne. */
function Avatar({
  name,
  size = "md",
  tone = "secondary",
  className,
}: {
  name: string
  size?: keyof typeof sizes
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <div
      aria-hidden
      data-slot="avatar"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export { Avatar }
