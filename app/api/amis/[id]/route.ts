import { prisma } from "@/lib/prisma"
import { findPrivateConversation, getCurrentUser } from "@/lib/chat"
import { erreur, nonConnecte, ok } from "@/lib/reponses"

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const friendship = await prisma.friendship.findUnique({ where: { id } })

  if (!friendship || friendship.receiverId !== user.id) {
    return erreur("Demande introuvable.", 404)
  }

  await prisma.friendship.update({ where: { id }, data: { accepted: true } })

  const conversation = await findPrivateConversation(friendship.requesterId, friendship.receiverId)
  if (conversation && !conversation.accepted) {
    await prisma.conversation.update({ where: { id: conversation.id }, data: { accepted: true } })
  }

  return ok()
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const friendship = await prisma.friendship.findUnique({ where: { id } })

  if (!friendship || (friendship.requesterId !== user.id && friendship.receiverId !== user.id)) {
    return erreur("Demande introuvable.", 404)
  }

  await prisma.friendship.delete({ where: { id } })

  return ok()
}
