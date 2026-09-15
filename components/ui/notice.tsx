import { cn } from "cn"

const variants = {
  /** Message d'information sous la zone de conversation. */
  footer: "border-t border-border px-4 py-4 text-center",
  /** Bandeau d'information au-dessus de la zone de conversation. */
  banner: "border-b border-border bg-muted/60 px-4 py-3",
}

function Notice({
  variant = "footer",
  className,
  children,
}: {
  variant?: keyof typeof variants
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("shrink-0 text-sm text-muted-foreground", variants[variant], className)}>
      {children}
    </div>
  )
}

export { Notice }
