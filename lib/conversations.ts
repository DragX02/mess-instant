import type { ConversationItem, CurrentUser } from "@/lib/types"

export function placeholderFor(conversation: ConversationItem | undefined) {
  if (!conversation) {
    return "Écrire un message"
  }

  if (conversation.type === "INFO" || conversation.type === "PUBLIC") {
    return "Écrire dans #" + conversation.name
  }

  return "Écrire à " + conversation.name
}

export function pendingState(conversation: ConversationItem | undefined, user: CurrentUser | null) {
  const pending = conversation?.type === "PRIVATE" && !conversation.accepted && user !== null

  return {
    pendingForMe: pending && conversation.createdById !== user.id,
    pendingByMe: pending && conversation.createdById === user.id,
  }
}
