import type { Conversation } from "@prisma/client"
import { DEFAULT_SERVER_ID } from "@/lib/galaxies"
import { prisma } from "@/lib/prisma"
import type { EvenementTempsReel } from "@/lib/types"

type Abonne = {
  userId: string | null
  envoyer: (evenement: EvenementTempsReel) => void
}

const globalPourBus = globalThis as unknown as { abonnes?: Set<Abonne> }
const abonnes = globalPourBus.abonnes ?? new Set<Abonne>()
globalPourBus.abonnes = abonnes

export function abonner(abonne: Abonne) {
  abonnes.add(abonne)
  return () => {
    abonnes.delete(abonne)
  }
}

export function publier(userIds: string[] | "tous", evenement: EvenementTempsReel) {
  for (const abonne of abonnes) {
    if (userIds === "tous" || (abonne.userId && userIds.includes(abonne.userId))) {
      abonne.envoyer(evenement)
    }
  }
}

export async function membresServeur(serverId: string) {
  const membres = await prisma.serverMember.findMany({ where: { serverId } })
  return membres.map((membre) => membre.userId)
}

export async function destinatairesConversation(conversation: Conversation) {
  if (conversation.serverId) {
    if (conversation.serverId === DEFAULT_SERVER_ID && conversation.type === "INFO") {
      return "tous"
    }
    return membresServeur(conversation.serverId)
  }

  const memberships = await prisma.membership.findMany({
    where: { conversationId: conversation.id },
  })
  return memberships.map((membership) => membership.userId)
}

export async function notifierConversation(
  conversation: Conversation,
  evenement: EvenementTempsReel,
) {
  publier(await destinatairesConversation(conversation), evenement)
}
