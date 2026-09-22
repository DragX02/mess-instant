import type { ConversationItem } from "@/lib/types"

/** Serveur par défaut, ouvert à tous : son #info est lisible même sans compte. */
export const DEFAULT_SERVER_ID = "helix"

/** Galaxie « Messages privés » : regroupe les groupes et conversations privées (hors serveur). */
export const PERSONAL_GALAXY = "prive"

/** Galaxie à laquelle appartient une conversation : son serveur, ou la galaxie personnelle. */
export function galaxyOf(conversation: ConversationItem) {
  return conversation.serverId ?? PERSONAL_GALAXY
}

export function conversationsIn(conversations: ConversationItem[], galaxyId: string) {
  return conversations.filter((conversation) => galaxyOf(conversation) === galaxyId)
}
