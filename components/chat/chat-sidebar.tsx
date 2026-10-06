"use client"

import Link from "next/link"
import { LogIn, MessageCircle, Orbit, UserPlus } from "lucide-react"
import { cn } from "cn"
import { PERSONAL_GALAXY, conversationsIn } from "@/lib/galaxies"
import type {
  ConversationItem,
  ConversationType,
  CurrentUser,
  Portefeuille,
  ServerItem,
} from "@/lib/types"
import type { UiTheme } from "@/hooks/use-ui-theme"
import { Button } from "@/components/ui/button"
import { SidebarButton, SidebarEmpty, SidebarSection } from "@/components/ui/sidebar-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConversationIcon } from "./conversation-icon"
import { UserMenu } from "./user-menu"

export function ChatSidebar({
  user,
  servers,
  conversations,
  galaxyId,
  selectedId,
  showFriends,
  open,
  theme,
  friendRequestCount,
  onClose,
  onSelect,
  onEnterGalaxy,
  onShowFriends,
  onCreateServer,
  onJoinServer,
  onCreateChannel,
  onNewGroup,
  onNewPrivate,
  portefeuille,
  onOpenShop,
  onOpenSettings,
  onSignOut,
}: {
  user: CurrentUser | null
  servers: ServerItem[]
  conversations: ConversationItem[]
  galaxyId: string | null
  selectedId: string
  showFriends: boolean
  open: boolean
  theme: UiTheme
  friendRequestCount: number
  onClose: () => void
  onSelect: (id: string) => void
  onEnterGalaxy: (id: string) => void
  onShowFriends: () => void
  onCreateServer: () => void
  onJoinServer: () => void
  onCreateChannel: () => void
  onNewGroup: () => void
  onNewPrivate: () => void
  portefeuille: Portefeuille | null
  onOpenShop: () => void
  onOpenSettings: () => void
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

  function galaxyEntry(id: string, label: string, icon: React.ReactNode) {
    return (
      <SidebarButton
        key={id}
        icon={icon}
        label={label}
        active={!showFriends && galaxyId === id && selectedId === ""}
        onClick={() => onEnterGalaxy(id)}
      />
    )
  }

  const server = servers.find((item) => item.id === galaxyId)
  const channels = server
    ? conversationsIn(conversations, server.id).sort(
        (a, b) => Number(b.type === "INFO") - Number(a.type === "INFO"),
      )
    : []
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
          <Link href="/" className="font-sans text-xl font-bold text-primary">
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

          <SidebarSection
            title={theme === "univers" ? "Galaxies" : "Serveurs"}
            onAdd={user ? onCreateServer : undefined}
          />
          {servers.map((item) =>
            galaxyEntry(item.id, item.name, <Orbit className="h-4 w-4 shrink-0" />),
          )}
          {user &&
            galaxyEntry(
              PERSONAL_GALAXY,
              "Messages privés",
              <MessageCircle className="h-4 w-4 shrink-0" />,
            )}
          {user && (
            <SidebarButton
              icon={<LogIn className="h-4 w-4 shrink-0" />}
              label="Rejoindre un serveur"
              onClick={onJoinServer}
            />
          )}

          {server && (
            <>
              <SidebarSection
                title={"Canaux · " + server.name}
                onAdd={server.canManage ? onCreateChannel : undefined}
              />
              {channels.map((conversation) => entry(conversation))}
            </>
          )}

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
            <UserMenu
              user={user}
              portefeuille={portefeuille}
              onOpenShop={onOpenShop}
              onOpenSettings={onOpenSettings}
              onSignOut={onSignOut}
            />
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
