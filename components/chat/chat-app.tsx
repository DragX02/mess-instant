"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api, apiSend } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { usePolling } from "@/hooks/use-polling"
import type { ConversationItem, CurrentUser, FriendsData, MessageItem } from "@/lib/types"
import { ChatDialogs, type DialogName } from "./chat-dialogs"
import { ChatHeader } from "./chat-header"
import { ChatSidebar } from "./chat-sidebar"
import { ConversationView } from "./conversation-view"
import { FriendsPanel } from "./friends-panel"

const NO_FRIENDS: FriendsData = { friends: [], received: [], sent: [] }

export function ChatApp({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedId, setSelectedId] = useState("info")
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [canWrite, setCanWrite] = useState(false)
  const [friendsData, setFriendsData] = useState<FriendsData>(NO_FRIENDS)
  const [showFriends, setShowFriends] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [dialog, setDialog] = useState<DialogName>("")
  const [refresh, setRefresh] = useState(0)

  // Conversations et amis : rafraîchis toutes les 5 s.
  usePolling(
    async (isActive) => {
      const list = await api<ConversationItem[]>("/api/conversations")
      if (list.ok && isActive()) {
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

  // Messages de la conversation ouverte : rafraîchis toutes les 2 s.
  usePolling(
    async (isActive) => {
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
    [selectedId, refresh],
  )

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
    setDialog("")
  }

  /** Crée (ou retrouve) une conversation puis l'ouvre. */
  async function openConversation(body: Record<string, unknown>) {
    const result = await api<{ id: string }>("/api/conversations", { method: "POST", body })

    if (!result.ok) {
      alert(result.error)
      return
    }

    selectConversation(result.data.id)
    reload()
  }

  async function createChannel() {
    const name = window.prompt("Nom du nouveau canal public")
    if (name) {
      await openConversation({ type: "PUBLIC", name })
    }
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
    selectConversation("info")
    reload()
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/auth/connexion")
    router.refresh()
  }

  const selected = conversations.find((conversation) => conversation.id === selectedId)

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedId={selectedId}
        showFriends={showFriends}
        open={showSidebar}
        friendRequestCount={friendsData.received.length}
        onClose={() => setShowSidebar(false)}
        onSelect={selectConversation}
        onShowFriends={() => {
          setShowFriends(true)
          setShowSidebar(false)
        }}
        onCreateChannel={createChannel}
        onNewGroup={() => setDialog("groupe")}
        onNewPrivate={() => setDialog("mp")}
        onSignOut={handleSignOut}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          user={user}
          conversation={selected}
          showFriends={showFriends}
          onOpenSidebar={() => setShowSidebar(true)}
          onShowMembers={() => setDialog("membres")}
          onDelete={deleteConversation}
        />

        {showFriends && user ? (
          <FriendsPanel
            data={friendsData}
            onChange={reload}
            onMessage={(userId) => openConversation({ type: "PRIVATE", userId })}
          />
        ) : (
          <ConversationView
            user={user}
            conversation={selected}
            conversationId={selectedId}
            messages={messages}
            canWrite={canWrite}
            onChange={reload}
            onAccept={acceptRequest}
            onDelete={deleteConversation}
          />
        )}
      </main>

      <ChatDialogs
        dialog={dialog}
        friends={friendsData.friends}
        conversation={selected}
        onClose={() => setDialog("")}
        onCreated={(id) => {
          selectConversation(id)
          reload()
        }}
        onChange={reload}
      />
    </div>
  )
}
