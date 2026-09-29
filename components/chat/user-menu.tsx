"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronUp, LogOut, Settings, User } from "lucide-react"
import type { CurrentUser } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"

export function UserMenu({
  user,
  onOpenSettings,
  onSignOut,
}: {
  user: CurrentUser
  onOpenSettings: () => void
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)

  function choose(action: () => void) {
    setOpen(false)
    action()
  }

  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-lg border border-border bg-card p-1 shadow-xl">
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
          >
            <User className="h-4 w-4 shrink-0" />
            Profil
          </Link>
          <button
            type="button"
            onClick={() => choose(onOpenSettings)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
          >
            <Settings className="h-4 w-4 shrink-0" />
            Paramètres
          </button>
          <button
            type="button"
            onClick={() => choose(onSignOut)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-destructive hover:bg-muted"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se déconnecter
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menu utilisateur"
        className="relative z-50 flex w-full items-center gap-2 rounded-lg p-1 text-left hover:bg-muted"
      >
        <Avatar name={user.name} tone="primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          {user.isAdmin && <p className="text-[11px] text-primary">Admin</p>}
        </div>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  )
}
