"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api, apiSend } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { PERSONAL_GALAXY, galaxyOf } from "@/lib/galaxies"
import { usePolling } from "@/hooks/use-polling"
import { useUiTheme } from "@/hooks/use-ui-theme"
import type {
  ConversationItem,
  CurrentUser,
  FriendsData,
  GroupMember,
  MessageItem,
  ServerItem,
} from "@/lib/types"
import { ChatDialogs, type DialogName } from "./chat-dialogs"
import { ChatHeader } from "./chat-header"
import { ChatSidebar } from "./chat-sidebar"
import { ClassicView } from "./classic-view"
import { ConversationView } from "./conversation-view"
import { FriendsPanel } from "./friends-panel"
import type { GalaxyStar } from "./space/galaxy"

const NO_FRIENDS: FriendsData = { friends: [], received: [], sent: [] }

export function ChatApp({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const { theme, apply } = useUiTheme()
  const [servers, setServers] = useState<ServerItem[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  // Navigation : univers (galaxyId null) › galaxie › planète ouverte.
  const [galaxyId, setGalaxyId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState("")
  const [planetOpen, setPlanetOpen] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [canWrite, setCanWrite] = useState(false)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [friendsData, setFriendsData] = useState<FriendsData>(NO_FRIENDS)
  const [showFriends, setShowFriends] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [dialog, setDialog] = useState<DialogName>("")
  const [refresh, setRefresh] = useState(0)

  // Serveurs, conversations et amis : rafraîchis toutes les 5 s.
  usePolling(
    async (isActive) => {
      const [serverList, list] = await Promise.all([
        api<ServerItem[]>("/api/serveurs"),
        api<ConversationItem[]>("/api/conversations"),
      ])
      if (!isActive()) {
        return
      }
      if (serverList.ok) {
        setServers(serverList.data)
      }
      if (list.ok) {
        setConversations(list.data)
      }

      if (!user) {
        return
      }

      const friends = await api<FriendsData>("/api/amis")
      if (friends.ok && isActive()) {
        setFriendsData(friends.data)
      }
    },
    5000,
    [user, refresh],
  )

  // Membres du serveur affiché, dessinés en étoiles dans sa galaxie.
  usePolling(
    async (isActive) => {
      if (!user || !galaxyId || galaxyId === PERSONAL_GALAXY) {
        return
      }
      const result = await api<GroupMember[]>("/api/serveurs/" + galaxyId + "/membres")
      if (isActive()) {
        setMembers(result.ok ? result.data : [])
      }
    },
    15000,
    [user, galaxyId, refresh],
  )

  // Messages de la planète ouverte : rafraîchis toutes les 2 s.
  usePolling(
    async (isActive) => {
      if (!planetOpen || !selectedId) {
        return
      }
      const result = await api<{ messages: MessageItem[]; canWrite: boolean }>(
        "/api/conversations/" + selectedId + "/messages",
      )
      if (!isActive()) {
        return
      }

      setMessages(result.ok ? result.data.messages : [])
      setCanWrite(result.ok ? result.data.canWrite : false)
    },
    2000,
    [selectedId, planetOpen, refresh],
  )

  function reload() {
    setRefresh((value) => value + 1)
  }

  function closePanels() {
    setShowFriends(false)
    setShowSidebar(false)
    setDialog("")
  }

  function toUniverse() {
    setGalaxyId(null)
    setPlanetOpen(false)
    setSelectedId("")
    closePanels()
  }

  function enterGalaxy(id: string) {
    if (id !== galaxyId) {
      setMembers([])
    }
    setGalaxyId(id)
    setPlanetOpen(false)
    setSelectedId("")
    closePanels()
  }

  /**
   * Ouvre une planète. Sa galaxie est déduite de la conversation ; `galaxy` sert quand
   * la conversation vient d'être créée et n'est pas encore dans la liste.
   */
  function selectConversation(id: string, galaxy?: string) {
    const found = conversations.find((conversation) => conversation.id === id)
    const target = galaxy ?? (found ? galaxyOf(found) : (galaxyId ?? PERSONAL_GALAXY))

    if (id !== selectedId) {
      setMessages([])
      setCanWrite(false)
    }
    if (target !== galaxyId) {
      setMembers([])
    }
    setGalaxyId(target)
    setSelectedId(id)
    setPlanetOpen(true)
    closePanels()
  }

  /** Crée (ou retrouve) une conversation privée ou un groupe, puis l'ouvre. */
  async function openConversation(body: Record<string, unknown>) {
    const result = await api<{ id: string }>("/api/conversations", { method: "POST", body })

    if (!result.ok) {
      alert(result.error)
      return
    }

    selectConversation(result.data.id, PERSONAL_GALAXY)
    reload()
  }

  async function createChannel() {
    const name = window.prompt("Nom du nouveau canal (une nouvelle planète)")
    if (!name || !galaxyId) {
      return
    }

    const result = await api<{ id: string }>("/api/conversations", {
      method: "POST",
      body: { type: "PUBLIC", name, serverId: galaxyId },
    })
    if (!result.ok) {
      alert(result.error)
      return
    }

    selectConversation(result.data.id, galaxyId)
    reload()
  }

  async function acceptRequest() {
    await apiSend("/api/conversations/" + selectedId, "PATCH")
    reload()
  }

  async function deleteConversation(question: string) {
    if (!confirm(question)) {
      return
    }

    await apiSend("/api/conversations/" + selectedId, "DELETE")
    setPlanetOpen(false)
    setSelectedId("")
    reload()
  }

  async function leaveServer() {
    const server = servers.find((item) => item.id === galaxyId)
    if (!server) {
      return
    }

    const question =
      server.role === "OWNER"
        ? "Supprimer le serveur « " + server.name + " » et tous ses canaux ?"
        : "Quitter le serveur « " + server.name + " » ?"
    if (!confirm(question)) {
      return
    }

    const result = await apiSend("/api/serveurs/" + server.id, "DELETE")
    if (!result.ok) {
      alert(result.error)
      return
    }

    toUniverse()
    reload()
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/auth/connexion")
    router.refresh()
  }

  const server = servers.find((item) => item.id === galaxyId)
  const selected = planetOpen
    ? conversations.find((conversation) => conversation.id === selectedId)
    : undefined
  const galaxyName =
    galaxyId === null
      ? null
      : galaxyId === PERSONAL_GALAXY
        ? "Messages privés"
        : server?.name || "Galaxie"

  // Galaxie personnelle : l'utilisateur est au centre, ses amis sont les étoiles.
  const stars: GalaxyStar[] =
    galaxyId === PERSONAL_GALAXY
      ? friendsData.friends.map((friend) => ({ id: friend.id, name: friend.name }))
      : members

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <ChatSidebar
        user={user}
        servers={servers}
        conversations={conversations}
        galaxyId={galaxyId}
        selectedId={planetOpen ? selectedId : ""}
        showFriends={showFriends}
        open={showSidebar}
        theme={theme}
        friendRequestCount={friendsData.received.length}
        onClose={() => setShowSidebar(false)}
        onSelect={(id) => selectConversation(id)}
        onEnterGalaxy={enterGalaxy}
        onShowFriends={() => {
          setShowFriends(true)
          setShowSidebar(false)
        }}
        onCreateServer={() => setDialog("serveur-creer")}
        onJoinServer={() => setDialog("serveur-rejoindre")}
        onCreateChannel={createChannel}
        onNewGroup={() => setDialog("groupe")}
        onNewPrivate={() => setDialog("mp")}
        onOpenSettings={() => setDialog("parametres")}
        onSignOut={handleSignOut}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          showFriends={showFriends}
          galaxyName={galaxyName}
          server={server}
          conversation={selected}
          theme={theme}
          onOpenSidebar={() => setShowSidebar(true)}
          onUniverse={toUniverse}
          onGalaxy={() => galaxyId && enterGalaxy(galaxyId)}
          onShowMembers={() => setDialog("membres")}
          onDelete={deleteConversation}
          onInvite={() => setDialog("inviter")}
          onCreateChannel={createChannel}
          onLeaveServer={leaveServer}
        />

        {showFriends && user ? (
          <FriendsPanel
            data={friendsData}
            onChange={reload}
            onMessage={(userId) => openConversation({ type: "PRIVATE", userId })}
          />
        ) : theme === "classique" ? (
          <ClassicView
            user={user}
            conversation={selected}
            conversationId={selectedId}
            open={planetOpen}
            messages={messages}
            canWrite={canWrite}
            canModerate={Boolean(user?.isAdmin || server?.canManage)}
            onChange={reload}
            onAccept={acceptRequest}
            onDelete={deleteConversation}
          />
        ) : (
          <ConversationView
            user={user}
            servers={servers}
            conversations={conversations}
            galaxyId={galaxyId}
            conversationId={selectedId}
            open={planetOpen}
            messages={messages}
            canWrite={canWrite}
            stars={stars}
            onChange={reload}
            onAccept={acceptRequest}
            onDelete={deleteConversation}
            onSelect={(id) => selectConversation(id)}
            onBack={() => galaxyId && enterGalaxy(galaxyId)}
            onEnterGalaxy={enterGalaxy}
            onUniverse={toUniverse}
            onCreateServer={() => setDialog("serveur-creer")}
            onJoinServer={() => setDialog("serveur-rejoindre")}
          />
        )}
      </main>

      <ChatDialogs
        dialog={dialog}
        friends={friendsData.friends}
        conversation={selected}
        server={server}
        theme={theme}
        onApplyTheme={apply}
        onClose={() => setDialog("")}
        onCreated={(id) => {
          selectConversation(id, PERSONAL_GALAXY)
          reload()
        }}
        onServerReady={(id) => {
          enterGalaxy(id)
          reload()
        }}
        onChange={reload}
      />
    </div>
  )
}
