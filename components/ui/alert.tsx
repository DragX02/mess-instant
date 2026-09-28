import { cn } from "cn"

const variants = {
  erreur: "border-destructive/20 bg-destructive/10 text-destructive",
  info: "border-border bg-muted text-muted-foreground",
}

function Alert({
  variant = "erreur",
  className,
  children,
}: {
  variant?: keyof typeof variants
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      role={variant === "erreur" ? "alert" : undefined}
      className={cn(
        "rounded-[var(--radius)] border px-3 py-2 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </p>
  )
}

export { Alert }
