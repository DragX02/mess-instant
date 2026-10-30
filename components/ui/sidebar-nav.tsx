import { Plus } from "lucide-react"
import { cn } from "cn"
import { IconButton } from "@/components/ui/icon-button"

function SidebarSection({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="mt-5 mb-1 flex items-center justify-between px-2">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </span>
      {onAdd && (
        <IconButton label={"Ajouter : " + title} onClick={onAdd} className="rounded p-0.5">
          <Plus className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  )
}

function SidebarButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  )
}

function SidebarEmpty({ children }: { children: React.ReactNode }) {
  return <p className="px-2 text-xs text-muted-foreground">{children}</p>
}

export { SidebarSection, SidebarButton, SidebarEmpty }
