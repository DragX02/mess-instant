"use client"

import { X } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"

/** Boîte de dialogue centrée, fermée au clic sur le fond ou sur la croix. */
function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <IconButton label="Fermer" onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

export { Modal }
