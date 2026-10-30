"use client"

import { SmilePlus, Trash2 } from "lucide-react"
import { cn } from "cn"
import type { ReactionItem } from "@/lib/types"
import { IconButton } from "@/components/ui/icon-button"

export function MessageTools({
  canDelete,
  onReact,
  onRemove,
  className,
}: {
  canDelete: boolean
  onReact: () => void
  onRemove: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute -top-3 flex gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100",
        className,
      )}
    >
      <IconButton label="Réagir" onClick={onReact} className="rounded">
        <SmilePlus className="h-4 w-4" />
      </IconButton>
      {canDelete && (
        <IconButton
          label="Supprimer le message"
          onClick={onRemove}
          className="rounded hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      )}
    </div>
  )
}

const tones = {
  clair: {
    pill: "",
    mine: "border-primary bg-primary/10 text-primary",
    other: "border-border bg-muted/60",
  },
  sombre: {
    pill: "text-white",
    mine: "border-primary bg-primary/30",
    other: "border-white/15 bg-white/10",
  },
}

export function ReactionList({
  reactions,
  disabled,
  tone,
  onReact,
}: {
  reactions: ReactionItem[]
  disabled: boolean
  tone: keyof typeof tones
  onReact: (emoji: string) => void
}) {
  if (reactions.length === 0) {
    return null
  }

  const style = tones[tone]

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          disabled={disabled}
          onClick={() => onReact(reaction.emoji)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
            style.pill,
            reaction.mine ? style.mine : style.other,
          )}
        >
          {reaction.emoji} {reaction.count}
        </button>
      ))}
    </div>
  )
}
