"use client"

import type { ConversationItem, Friend, ServerItem } from "@/lib/types"
import { GroupMembersDialog } from "./group-members-dialog"
import { NewGroupDialog } from "./new-group-dialog"
import { NewPrivateDialog } from "./new-private-dialog"
import { InviteDialog, ServerDialog } from "./server-dialogs"

export type DialogName =
  "" | "groupe" | "mp" | "membres" | "serveur-creer" | "serveur-rejoindre" | "inviter"

export function ChatDialogs({
  dialog,
  friends,
  conversation,
  server,
  onClose,
  onCreated,
  onServerReady,
  onChange,
}: {
  dialog: DialogName
  friends: Friend[]
  conversation: ConversationItem | undefined
  server: ServerItem | undefined
  onClose: () => void
  onCreated: (id: string) => void
  /** Serveur créé ou rejoint : on entre dans sa galaxie. */
  onServerReady: (serverId: string) => void
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

  if (dialog === "serveur-creer" || dialog === "serveur-rejoindre") {
    return (
      <ServerDialog
        mode={dialog === "serveur-creer" ? "creer" : "rejoindre"}
        onClose={onClose}
        onDone={onServerReady}
      />
    )
  }

  if (dialog === "inviter" && server) {
    return <InviteDialog server={server} onClose={onClose} />
  }

  return null
}
