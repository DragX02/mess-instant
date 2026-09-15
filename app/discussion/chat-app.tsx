"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Hash,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MessageList } from "./message-list"
import { MessageForm } from "./message-form"
import { FriendsPanel } from "./friends-panel"
import { NewGroupDialog } from "./new-group-dialog"
import { NewPrivateDialog } from "./new-private-dialog"
import { GroupMembersDialog } from "./group-members-dialog"
import type { ConversationItem, CurrentUser, FriendsData, MessageItem } from "./types"

function ConversationIcon({ type }: { type: string }) {
  if (type === "INFO") {
    return <Megaphone className="h-4 w-4 shrink-0" />
  }
  if (type === "GROUP") {
    return <Users className="h-4 w-4 shrink-0" />
  }
  if (type === "PRIVATE") {
    return <MessageCircle className="h-4 w-4 shrink-0" />
  }
  return <Hash className="h-4 w-4 shrink-0" />
}

function SectionTitle({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="mt-5 mb-1 flex items-center justify-between px-2">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </span>
      {onAdd && (
        <button
          onClick={onAdd}
          aria-label={"Ajouter : " + title}
          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
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
  active: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
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

export function ChatApp({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedId, setSelectedId] = useState("info")
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [canWrite, setCanWrite] = useState(false)
  const [friendsData, setFriendsData] = useState<FriendsData>({
    friends: [],
    received: [],
    sent: [],
  })
  const [showFriends, setShowFriends] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [dialog, setDialog] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let stop = false

    async function load() {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        if (!stop) {
          setConversations(data)
        }
      }

      if (user) {
        const friendsResponse = await fetch("/api/amis")
        if (friendsResponse.ok) {
          const data = await friendsResponse.json()
          if (!stop) {
            setFriendsData(data)
          }
        }
      }
    }

    load()
    const timer = setInterval(load, 5000)

    return () => {
      stop = true
      clearInterval(timer)
    }
  }, [user, refresh])

  useEffect(() => {
    let stop = false

    async function load() {
      const response = await fetch("/api/conversations/" + selectedId + "/messages")
      if (stop) {
        return
      }
      if (!response.ok) {
        setMessages([])
        setCanWrite(false)
        return
      }
      const data = await response.json()
      if (!stop) {
        setMessages(data.messages)
        setCanWrite(data.canWrite)
      }
    }

    load()
    const timer = setInterval(load, 2000)

    return () => {
      stop = true
      clearInterval(timer)
    }
  }, [selectedId, refresh])

  function reload() {
    setRefresh((value) => value + 1)
  }

  function selectConversation(id: string) {
    if (id !== selectedId) {
      setMessages([])
      setCanWrite(false)
    }
    setSelectedId(id)
    setShowFriends(false)
    setShowSidebar(false)
  }

  async function createChannel() {
    const name = window.prompt("Nom du nouveau canal public")
    if (!name) {
      return
    }

    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PUBLIC", name: name }),
    })
    const data = await response.json()

    if (!response.ok) {
      alert(data.error)
      return
    }

    selectConversation(data.id)
    reload()
  }

  async function openPrivate(userId: string) {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PRIVATE", userId: userId }),
    })
    const data = await response.json()

    if (!response.ok) {
      alert(data.error)
      return
    }

    selectConversation(data.id)
    reload()
  }

  async function acceptRequest() {
    await fetch("/api/conversations/" + selectedId, { method: "PATCH" })
    reload()
  }

  async function deleteConversation(question: string) {
    if (!confirm(question)) {
      return
    }

    await fetch("/api/conversations/" + selectedId, { method: "DELETE" })
    selectConversation("info")
    reload()
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/auth/connexion")
    router.refresh()
  }

  const selected = conversations.find((conversation) => conversation.id === selectedId)
  const channels = conversations.filter((item) => item.type === "INFO" || item.type === "PUBLIC")
  const groups = conversations.filter((item) => item.type === "GROUP")
  const privates = conversations.filter((item) => item.type === "PRIVATE")

  const isPending = selected !== undefined && selected.type === "PRIVATE" && !selected.accepted
  const pendingForMe = isPending && user !== null && selected.createdById !== user.id
  const pendingByMe = isPending && user !== null && selected.createdById === user.id

  let title = selected ? selected.name || "" : "info"
  let placeholder = "Écrire un message"
  if (selected && (selected.type === "INFO" || selected.type === "PUBLIC")) {
    placeholder = "Écrire dans #" + selected.name
  } else if (selected) {
    placeholder = "Écrire à " + selected.name
  }
  if (showFriends) {
    title = "Amis"
  }

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {showSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:translate-x-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
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
              badge={friendsData.received.length > 0 ? String(friendsData.received.length) : ""}
              onClick={() => {
                setShowFriends(true)
                setShowSidebar(false)
              }}
            />
          )}

          <SectionTitle title="Canaux" onAdd={user && user.isAdmin ? createChannel : undefined} />
          {channels.map((conversation) => (
            <SidebarButton
              key={conversation.id}
              icon={<ConversationIcon type={conversation.type} />}
              label={conversation.name || ""}
              active={!showFriends && conversation.id === selectedId}
              onClick={() => selectConversation(conversation.id)}
            />
          ))}

          {user && (
            <>
              <SectionTitle title="Groupes" onAdd={() => setDialog("groupe")} />
              {groups.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">Aucun groupe</p>
              )}
              {groups.map((conversation) => (
                <SidebarButton
                  key={conversation.id}
                  icon={<ConversationIcon type={conversation.type} />}
                  label={conversation.name || ""}
                  active={!showFriends && conversation.id === selectedId}
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}

              <SectionTitle title="Messages privés" onAdd={() => setDialog("mp")} />
              {privates.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">Aucun message privé</p>
              )}
              {privates.map((conversation) => (
                <SidebarButton
                  key={conversation.id}
                  icon={<ConversationIcon type={conversation.type} />}
                  label={conversation.name || ""}
                  active={!showFriends && conversation.id === selectedId}
                  badge={
                    !conversation.accepted && conversation.createdById !== user.id ? "demande" : ""
                  }
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-border p-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                {user.isAdmin && <p className="text-[11px] text-primary">Admin</p>}
              </div>
              <button
                onClick={handleSignOut}
                aria-label="Se déconnecter"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
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

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <button
            className="rounded-md p-1 text-muted-foreground hover:bg-muted md:hidden"
            onClick={() => setShowSidebar(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {!showFriends && <ConversationIcon type={selected ? selected.type : "INFO"} />}
          <h1 className="truncate font-semibold">{title}</h1>
          {!showFriends && selected && selected.type === "GROUP" && (
            <span className="text-xs text-muted-foreground">{selected.memberCount} membres</span>
          )}

          <div className="ml-auto flex items-center gap-1">
            {!showFriends && selected && selected.type === "GROUP" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setDialog("membres")}>
                  <Users />
                  Membres
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteConversation("Quitter ce groupe ?")}
                >
                  Quitter
                </Button>
              </>
            )}
            {!showFriends &&
              selected &&
              selected.type === "PUBLIC" &&
              selected.id !== "general" &&
              user &&
              user.isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteConversation("Supprimer ce canal et tous ses messages ?")}
                >
                  <Trash2 />
                  Supprimer
                </Button>
              )}
          </div>
        </header>

        {showFriends && user ? (
          <FriendsPanel data={friendsData} onChange={reload} onMessage={openPrivate} />
        ) : (
          <>
            {pendingForMe && selected && (
              <div className="flex flex-wrap items-center gap-3 border-b border-border bg-accent/40 px-4 py-3 text-sm">
                <span>
                  <strong>{selected.name}</strong> souhaite vous envoyer des messages privés.
                </span>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" onClick={acceptRequest}>
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteConversation("Refuser et supprimer cette conversation ?")}
                  >
                    Refuser
                  </Button>
                </div>
              </div>
            )}

            {pendingByMe && selected && (
              <div className="border-b border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                Vous n&apos;êtes pas encore amis : {selected.name} doit accepter vos messages privés
                pour pouvoir vous répondre.
              </div>
            )}

            <MessageList messages={messages} user={user} onChange={reload} />

            {!user && (
              <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
                Vous êtes visiteur : vous pouvez lire le canal #info.{" "}
                <Link href="/auth/connexion" className="text-primary hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour discuter.
              </div>
            )}

            {user && canWrite && (
              <MessageForm
                key={selectedId}
                conversationId={selectedId}
                placeholder={placeholder}
                onSent={reload}
              />
            )}

            {user && !canWrite && selected && selected.type === "INFO" && (
              <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
                Seuls les administrateurs peuvent écrire dans #info.
              </div>
            )}

            {user && !canWrite && pendingForMe && (
              <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
                Acceptez la demande pour pouvoir répondre.
              </div>
            )}
          </>
        )}
      </main>

      {dialog === "groupe" && (
        <NewGroupDialog
          friends={friendsData.friends}
          onClose={() => setDialog("")}
          onCreated={(id) => {
            setDialog("")
            selectConversation(id)
            reload()
          }}
        />
      )}

      {dialog === "mp" && (
        <NewPrivateDialog
          friends={friendsData.friends}
          onClose={() => setDialog("")}
          onCreated={(id) => {
            setDialog("")
            selectConversation(id)
            reload()
          }}
        />
      )}

      {dialog === "membres" && selected && (
        <GroupMembersDialog
          conversationId={selected.id}
          friends={friendsData.friends}
          onClose={() => setDialog("")}
          onChange={reload}
        />
      )}
    </div>
  )
}
