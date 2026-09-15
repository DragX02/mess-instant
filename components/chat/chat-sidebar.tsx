"use client"

import Link from "next/link"
import { LogOut, UserPlus } from "lucide-react"
import { cn } from "cn"
import type { ConversationItem, ConversationType, CurrentUser } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { SidebarButton, SidebarEmpty, SidebarSection } from "@/components/ui/sidebar-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConversationIcon } from "./conversation-icon"

export function ChatSidebar({
  user,
  conversations,
  selectedId,
  showFriends,
  open,
  friendRequestCount,
  onClose,
  onSelect,
  onShowFriends,
  onCreateChannel,
  onNewGroup,
  onNewPrivate,
  onSignOut,
}: {
  user: CurrentUser | null
  conversations: ConversationItem[]
  selectedId: string
  showFriends: boolean
  open: boolean
  friendRequestCount: number
  onClose: () => void
  onSelect: (id: string) => void
  onShowFriends: () => void
  onCreateChannel: () => void
  onNewGroup: () => void
  onNewPrivate: () => void
  onSignOut: () => void
}) {
  function list(...types: ConversationType[]) {
    return conversations.filter((conversation) => types.includes(conversation.type))
  }

  function entry(conversation: ConversationItem, badge?: string) {
    return (
      <SidebarButton
        key={conversation.id}
        icon={<ConversationIcon type={conversation.type} />}
        label={conversation.name || ""}
        active={!showFriends && conversation.id === selectedId}
        badge={badge}
        onClick={() => onSelect(conversation.id)}
      />
    )
  }

  const privates = list("PRIVATE")
  const groups = list("GROUP")

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/" className="text-xl font-bold font-sans text-primary">
            Helix
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {user && (
            <SidebarButton
              icon={<UserPlus className="h-4 w-4 shrink-0" />}
              label="Amis"
              active={showFriends}
              badge={friendRequestCount > 0 ? String(friendRequestCount) : ""}
              onClick={onShowFriends}
            />
          )}

          <SidebarSection title="Canaux" onAdd={user?.isAdmin ? onCreateChannel : undefined} />
          {list("INFO", "PUBLIC").map((conversation) => entry(conversation))}

          {user && (
            <>
              <SidebarSection title="Groupes" onAdd={onNewGroup} />
              {groups.length === 0 && <SidebarEmpty>Aucun groupe</SidebarEmpty>}
              {groups.map((conversation) => entry(conversation))}

              <SidebarSection title="Messages privés" onAdd={onNewPrivate} />
              {privates.length === 0 && <SidebarEmpty>Aucun message privé</SidebarEmpty>}
              {privates.map((conversation) =>
                entry(
                  conversation,
                  !conversation.accepted && conversation.createdById !== user.id ? "demande" : "",
                ),
              )}
            </>
          )}
        </nav>

        <div className="border-t border-border p-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar name={user.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                {user.isAdmin && <p className="text-[11px] text-primary">Admin</p>}
              </div>
              <IconButton label="Se déconnecter" onClick={onSignOut} className="p-2">
                <LogOut className="h-4 w-4" />
              </IconButton>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button nativeButton={false} render={<Link href="/auth/connexion" />}>
                Se connecter
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/auth/inscription" />}
              >
                Créer un compte
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
