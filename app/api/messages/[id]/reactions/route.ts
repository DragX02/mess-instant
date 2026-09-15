import { prisma } from "@/lib/prisma"
import { canRead, getCurrentUser } from "@/lib/chat"

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: true },
  })

  if (!message || !(await canRead(message.conversation, user))) {
    return Response.json({ error: "Message introuvable." }, { status: 404 })
  }

  const body = await request.json()
  const emoji = typeof body.emoji === "string" ? body.emoji : ""

  if (emoji === "" || emoji.length > 16) {
    return Response.json({ error: "Emoji invalide." }, { status: 400 })
  }

  const existing = await prisma.reaction.findUnique({
    where: { userId_messageId_emoji: { userId: user.id, messageId: id, emoji: emoji } },
  })

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } })
  } else {
    await prisma.reaction.create({ data: { userId: user.id, messageId: id, emoji: emoji } })
  }

  return Response.json({ ok: true })
}
