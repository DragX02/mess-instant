"use client"

import type { ConversationItem, Friend } from "@/lib/types"
import { GroupMembersDialog } from "./group-members-dialog"
import { NewGroupDialog } from "./new-group-dialog"
import { NewPrivateDialog } from "./new-private-dialog"

export type DialogName = "" | "groupe" | "mp" | "membres"

export function ChatDialogs({
  dialog,
  friends,
  conversation,
  onClose,
  onCreated,
  onChange,
}: {
  dialog: DialogName
  friends: Friend[]
  conversation: ConversationItem | undefined
  onClose: () => void
  onCreated: (id: string) => void
  onChange: () => void
}) {
  if (dialog === "groupe") {
    return <NewGroupDialog friends={friends} onClose={onClose} onCreated={onCreated} />
  }

  if (dialog === "mp") {
    return <NewPrivateDialog friends={friends} onClose={onClose} onCreated={onCreated} />
  }

  if (dialog === "membres" && conversation) {
    return (
      <GroupMembersDialog
        conversationId={conversation.id}
        friends={friends}
        onClose={onClose}
        onChange={onChange}
      />
    )
  }

  return null
}
