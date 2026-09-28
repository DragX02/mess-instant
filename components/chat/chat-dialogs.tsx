"use client"

import type { ConversationItem, Friend, ServerItem } from "@/lib/types"
import type { UiTheme } from "@/hooks/use-ui-theme"
import { GroupMembersDialog } from "./group-members-dialog"
import { NewGroupDialog } from "./new-group-dialog"
import { NewPrivateDialog } from "./new-private-dialog"
import { InviteDialog, ServerDialog } from "./server-dialogs"
import { SettingsDialog } from "./settings-dialog"

export type DialogName =
  | ""
  | "groupe"
  | "mp"
  | "membres"
  | "serveur-creer"
  | "serveur-rejoindre"
  | "inviter"
  | "parametres"

export function ChatDialogs({
  dialog,
  friends,
  conversation,
  server,
  theme,
  onApplyTheme,
  onClose,
  onCreated,
  onServerReady,
  onChange,
}: {
  dialog: DialogName
  friends: Friend[]
  conversation: ConversationItem | undefined
  server: ServerItem | undefined
  theme: UiTheme
  onApplyTheme: (theme: UiTheme) => void
  onClose: () => void
  onCreated: (id: string) => void
  onServerReady: (serverId: string) => void
  onChange: () => void
}) {
  if (dialog === "parametres") {
    return <SettingsDialog current={theme} onApply={onApplyTheme} onClose={onClose} />
  }

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
