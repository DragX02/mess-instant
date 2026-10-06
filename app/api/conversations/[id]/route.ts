import type { Conversation, User } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { canManageServer, getCurrentUser, isMember } from "@/lib/chat"
import { actionImpossible, erreur, nonConnecte, ok } from "@/lib/reponses"
import { destinatairesConversation, notifierConversation, publier } from "@/lib/temps-reel"

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || conversation.type !== "PRIVATE") {
    return erreur("Conversation introuvable.", 404)
  }
  if (!(await isMember(user.id, id)) || conversation.createdById === user.id) {
    return actionImpossible()
  }

  await prisma.conversation.update({ where: { id }, data: { accepted: true } })
  await notifierConversation(conversation, { type: "donnees" })

  return ok()
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation) {
    return erreur("Conversation introuvable.", 404)
  }

  const destinataires = await destinatairesConversation(conversation)
  const reponse = await supprimer(conversation, user)

  if (reponse.ok) {
    publier(destinataires, { type: "donnees" })
  }
  return reponse
}

async function supprimer(conversation: Conversation, user: User) {
  const id = conversation.id

  if (conversation.type === "PUBLIC") {
    const canManage = conversation.serverId
      ? await canManageServer(user, conversation.serverId)
      : user.isAdmin
    if (!canManage || conversation.id === "general") {
      return actionImpossible()
    }
    await prisma.conversation.delete({ where: { id } })
    return ok()
  }

  if (!(await isMember(user.id, id))) {
    return actionImpossible()
  }

  if (conversation.type === "PRIVATE") {
    await prisma.conversation.delete({ where: { id } })
    return ok()
  }

  if (conversation.type === "GROUP") {
    await prisma.membership.delete({
      where: { userId_conversationId: { userId: user.id, conversationId: id } },
    })

    const remaining = await prisma.membership.count({ where: { conversationId: id } })
    if (remaining === 0) {
      await prisma.conversation.delete({ where: { id } })
    }
    return ok()
  }

  return actionImpossible()
}
