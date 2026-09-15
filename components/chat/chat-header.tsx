"use client"

import { Menu, Trash2, Users } from "lucide-react"
import type { ConversationItem, CurrentUser } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { ConversationIcon } from "./conversation-icon"

export function ChatHeader({
  user,
  conversation,
  showFriends,
  onOpenSidebar,
  onShowMembers,
  onDelete,
}: {
  user: CurrentUser | null
  conversation: ConversationItem | undefined
  showFriends: boolean
  onOpenSidebar: () => void
  onShowMembers: () => void
  onDelete: (question: string) => void
}) {
  const isGroup = !showFriends && conversation?.type === "GROUP"
  // Le canal « général » est créé automatiquement : on ne peut pas le supprimer.
  const canDeleteChannel =
    !showFriends &&
    conversation?.type === "PUBLIC" &&
    conversation.id !== "general" &&
    Boolean(user?.isAdmin)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <IconButton label="Ouvrir le menu" onClick={onOpenSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </IconButton>

      {!showFriends && <ConversationIcon type={conversation?.type ?? "INFO"} />}
      <h1 className="truncate font-semibold">
        {showFriends ? "Amis" : conversation?.name || "info"}
      </h1>
      {isGroup && (
        <span className="text-xs text-muted-foreground">{conversation.memberCount} membres</span>
      )}

      <div className="ml-auto flex items-center gap-1">
        {isGroup && (
          <>
            <Button variant="ghost" size="sm" onClick={onShowMembers}>
              <Users />
              Membres
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete("Quitter ce groupe ?")}
            >
              Quitter
            </Button>
          </>
        )}
        {canDeleteChannel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete("Supprimer ce canal et tous ses messages ?")}
          >
            <Trash2 />
            Supprimer
          </Button>
        )}
      </div>
    </header>
  )
}
