import { prisma } from "@/lib/prisma"
import { getCurrentUser, isMember } from "@/lib/chat"

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || conversation.type !== "PRIVATE") {
    return Response.json({ error: "Conversation introuvable." }, { status: 404 })
  }
  if (!(await isMember(user.id, id)) || conversation.createdById === user.id) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  await prisma.conversation.update({ where: { id }, data: { accepted: true } })

  return Response.json({ ok: true })
}

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation) {
    return Response.json({ error: "Conversation introuvable." }, { status: 404 })
  }

  if (conversation.type === "PUBLIC") {
    if (!user.isAdmin || conversation.id === "general") {
      return Response.json({ error: "Action impossible." }, { status: 403 })
    }
    await prisma.conversation.delete({ where: { id } })
    return Response.json({ ok: true })
  }

  if (!(await isMember(user.id, id))) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  if (conversation.type === "PRIVATE") {
    await prisma.conversation.delete({ where: { id } })
    return Response.json({ ok: true })
  }

  if (conversation.type === "GROUP") {
    await prisma.membership.delete({
      where: { userId_conversationId: { userId: user.id, conversationId: id } },
    })

    const remaining = await prisma.membership.count({ where: { conversationId: id } })
    if (remaining === 0) {
      await prisma.conversation.delete({ where: { id } })
    }
    return Response.json({ ok: true })
  }

  return Response.json({ error: "Action impossible." }, { status: 403 })
}
