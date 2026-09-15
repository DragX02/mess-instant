"use client"

import { cn } from "cn"

const variants = {
  /** Grille complète, pour le formulaire de message. */
  grid: "grid grid-cols-8 gap-1 p-2 text-xl sm:grid-cols-10",
  /** Rangée compacte, pour les réactions rapides sous un message. */
  row: "flex w-fit gap-1 p-1 text-lg",
}

export function EmojiPicker({
  emojis,
  onSelect,
  variant = "grid",
  className,
}: {
  emojis: string[]
  onSelect: (emoji: string) => void
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", variants[variant], className)}>
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="rounded p-1 hover:bg-muted"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
