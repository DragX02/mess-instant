import { cn } from "cn"
import { Avatar } from "@/components/ui/avatar"

/** Ligne « avatar + nom (+ sous-titre) + actions », utilisée pour les amis et les membres. */
export function PersonRow({
  name,
  subtitle,
  className,
  children,
}: {
  name: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2",
        className,
      )}
    >
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
