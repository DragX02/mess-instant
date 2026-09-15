import { prisma } from "@/lib/prisma"
import { findPrivateConversation, getCurrentUser } from "@/lib/chat"

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const friendship = await prisma.friendship.findUnique({ where: { id } })

  if (!friendship || friendship.receiverId !== user.id) {
    return Response.json({ error: "Demande introuvable." }, { status: 404 })
  }

  await prisma.friendship.update({ where: { id }, data: { accepted: true } })

  const conversation = await findPrivateConversation(friendship.requesterId, friendship.receiverId)
  if (conversation && !conversation.accepted) {
    await prisma.conversation.update({ where: { id: conversation.id }, data: { accepted: true } })
  }

  return Response.json({ ok: true })
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const friendship = await prisma.friendship.findUnique({ where: { id } })

  if (!friendship || (friendship.requesterId !== user.id && friendship.receiverId !== user.id)) {
    return Response.json({ error: "Demande introuvable." }, { status: 404 })
  }

  await prisma.friendship.delete({ where: { id } })

  return Response.json({ ok: true })
}
