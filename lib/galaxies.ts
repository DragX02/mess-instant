import type { ConversationItem } from "@/lib/types"

export const DEFAULT_SERVER_ID = "helix"

export const PERSONAL_GALAXY = "prive"

export function galaxyOf(conversation: ConversationItem) {
  return conversation.serverId ?? PERSONAL_GALAXY
}

export function conversationsIn(conversations: ConversationItem[], galaxyId: string) {
  return conversations.filter((conversation) => galaxyOf(conversation) === galaxyId)
}
