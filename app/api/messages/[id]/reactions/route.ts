import { prisma } from "@/lib/prisma"
import { canRead, getCurrentUser } from "@/lib/chat"
import { donnerPieces } from "@/lib/monnaie"
import { erreur, nonConnecte, ok } from "@/lib/reponses"
import { idValide } from "@/lib/validation-url"
import { notifierConversation } from "@/lib/temps-reel"

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  if (!idValide(id)) {
    return erreur("Introuvable.", 404)
  }
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true },
  })

  if (!message || !(await canRead(message.conversation, user))) {
    return erreur("Message introuvable.", 404)
  }

  const body = await request.json()
  const emoji = typeof body.emoji === "string" ? body.emoji : ""

  if (emoji === "" || emoji.length > 16) {
    return erreur("Emoji invalide.", 400)
  }

  const existing = await prisma.reaction.findUnique({
    where: { userId_messageId_emoji: { userId: user.id, messageId: id, emoji: emoji } },
  })

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } })
  } else {
    await prisma.reaction.create({ data: { userId: user.id, messageId: id, emoji: emoji } })
    await donnerPieces(user.id)
  }

  await notifierConversation(message.conversation, {
    type: "messages",
    conversationId: message.conversationId,
  })

  return ok()
}
