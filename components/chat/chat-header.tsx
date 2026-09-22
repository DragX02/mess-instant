"use client"

import { ChevronRight, LogOut, Menu, Plus, Trash2, UserPlus, Users } from "lucide-react"
import type { ConversationItem, ServerItem } from "@/lib/types"
import { DEFAULT_SERVER_ID } from "@/lib/galaxies"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { ConversationIcon } from "./conversation-icon"

/**
 * En-tête de la messagerie : fil d'Ariane (Univers › galaxie › canal) et actions
 * du niveau affiché (gérer le serveur dans une galaxie, le canal ou le groupe sur une planète).
 */
export function ChatHeader({
  showFriends,
  galaxyName,
  server,
  conversation,
  onOpenSidebar,
  onUniverse,
  onGalaxy,
  onShowMembers,
  onDelete,
  onInvite,
  onCreateChannel,
  onLeaveServer,
}: {
  showFriends: boolean
  /** null : vue de l'univers. */
  galaxyName: string | null
  /** Le serveur de la galaxie affichée (absent pour la galaxie personnelle). */
  server: ServerItem | undefined
  /** La planète ouverte, s'il y en a une. */
  conversation: ConversationItem | undefined
  onOpenSidebar: () => void
  onUniverse: () => void
  onGalaxy: () => void
  onShowMembers: () => void
  onDelete: (question: string) => void
  onInvite: () => void
  onCreateChannel: () => void
  onLeaveServer: () => void
}) {
  const inGalaxy = !showFriends && galaxyName !== null && !conversation
  const onPlanet = !showFriends && conversation !== undefined
  const isGroup = onPlanet && conversation.type === "GROUP"
  // Le canal « général » d'Helix est créé automatiquement : on ne peut pas le supprimer.
  const canDeleteChannel =
    onPlanet &&
    conversation.type === "PUBLIC" &&
    conversation.id !== "general" &&
    Boolean(server?.canManage)
  const serverActions = inGalaxy && server?.role != null

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <IconButton label="Ouvrir le menu" onClick={onOpenSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </IconButton>

      {showFriends ? (
        <h1 className="truncate font-semibold">Amis</h1>
      ) : (
        <nav aria-label="Fil d'Ariane" className="flex min-w-0 items-center gap-1">
          {galaxyName === null ? (
            <h1 className="truncate font-semibold">Univers</h1>
          ) : (
            <>
              <button
                onClick={onUniverse}
                className="hidden shrink-0 text-sm text-muted-foreground hover:text-foreground sm:block"
              >
                Univers
              </button>
              <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              {conversation ? (
                <>
                  <button
                    onClick={onGalaxy}
                    className="truncate text-sm text-muted-foreground hover:text-foreground"
                  >
                    {galaxyName}
                  </button>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <ConversationIcon type={conversation.type} />
                  <h1 className="truncate font-semibold">{conversation.name}</h1>
                </>
              ) : (
                <h1 className="truncate font-semibold">{galaxyName}</h1>
              )}
            </>
          )}
        </nav>
      )}

      {isGroup && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {conversation.memberCount} membres
        </span>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {serverActions && (
          <>
            <Button variant="ghost" size="sm" onClick={onInvite}>
              <UserPlus />
              <span className="hidden sm:inline">Inviter</span>
            </Button>
            {server.canManage && (
              <Button variant="ghost" size="sm" onClick={onCreateChannel}>
                <Plus />
                <span className="hidden sm:inline">Canal</span>
              </Button>
            )}
            {server.id !== DEFAULT_SERVER_ID && (
              <Button variant="destructive" size="sm" onClick={onLeaveServer}>
                {server.role === "OWNER" ? <Trash2 /> : <LogOut />}
                <span className="hidden sm:inline">
                  {server.role === "OWNER" ? "Supprimer" : "Quitter"}
                </span>
              </Button>
            )}
          </>
        )}
        {isGroup && (
          <>
            <Button variant="ghost" size="sm" onClick={onShowMembers}>
              <Users />
              Membres
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete("Quitter ce groupe ?")}>
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
