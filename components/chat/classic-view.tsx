"use client"

import { MessagesSquare } from "lucide-react"
import { placeholderFor } from "@/lib/conversations"
import type { ConversationItem, CurrentUser, MessageItem } from "@/lib/types"
import { ChatNotices, PendingBanners } from "./conversation-notices"
import { ClassicMessageForm } from "./classic-message-form"
import { ClassicMessageList } from "./classic-message-list"

export function ClassicView({
  user,
  conversation,
  conversationId,
  open,
  messages,
  canWrite,
  canModerate,
  onChange,
  onAccept,
  onDelete,
}: {
  user: CurrentUser | null
  conversation: ConversationItem | undefined
  conversationId: string
  open: boolean
  messages: MessageItem[]
  canWrite: boolean
  canModerate: boolean
  onChange: () => void
  onAccept: () => void
  onDelete: (question: string) => void
}) {
  if (!open || !conversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <MessagesSquare className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Choisissez une conversation dans le menu de gauche pour commencer.
        </p>
      </div>
    )
  }

  return (
    <>
      <PendingBanners
        conversation={conversation}
        user={user}
        onAccept={onAccept}
        onDelete={onDelete}
      />

      <ClassicMessageList
        messages={messages}
        user={user}
        canModerate={canModerate}
        onChange={onChange}
      />

      {user && canWrite && (
        <ClassicMessageForm
          key={conversationId}
          conversationId={conversationId}
          placeholder={placeholderFor(conversation)}
          onSent={onChange}
        />
      )}

      <ChatNotices user={user} conversation={conversation} open={open} canWrite={canWrite} />
    </>
  )
}
