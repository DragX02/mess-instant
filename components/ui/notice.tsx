import { cn } from "cn"

const variants = {
  footer: "border-t border-border px-4 py-4 text-center",
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
