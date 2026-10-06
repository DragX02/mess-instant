"use client"

import { X } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"

export type ToastMessage = {
  id: string
  conversationId: string
  titre: string
  texte: string
}

export function MessageToasts({
  toasts,
  onOpen,
  onClose,
}: {
  toasts: ToastMessage[]
  onOpen: (conversationId: string) => void
  onClose: (id: string) => void
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-72 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex items-start gap-2 rounded-[var(--radius)] border border-border bg-card p-3 shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          <button
            type="button"
            onClick={() => {
              onOpen(toast.conversationId)
              onClose(toast.id)
            }}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-sm font-medium text-foreground">{toast.titre}</p>
            <p className="line-clamp-2 text-sm text-muted-foreground">{toast.texte}</p>
          </button>
          <IconButton label="Fermer" onClick={() => onClose(toast.id)}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      ))}
    </div>
  )
}
