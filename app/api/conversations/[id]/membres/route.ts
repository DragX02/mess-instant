import { prisma } from "@/lib/prisma"
import { areFriends, getCurrentUser, isMember } from "@/lib/chat"

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user || !(await isMember(user.id, id))) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  const memberships = await prisma.membership.findMany({
    where: { conversationId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  })

  const result = memberships.map((membership) => ({
    id: membership.user.id,
    name: membership.user.name || membership.user.email,
    role: membership.role,
  }))

  return Response.json(result)
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || conversation.type !== "GROUP" || !(await isMember(user.id, id))) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  const body = await request.json()
  const userId = typeof body.userId === "string" ? body.userId : ""

  if (!(await areFriends(user.id, userId))) {
    return Response.json({ error: "Vous ne pouvez ajouter que vos amis." }, { status: 400 })
  }
  if (await isMember(userId, id)) {
    return Response.json({ error: "Cette personne est déjà dans le groupe." }, { status: 400 })
  }

  await prisma.membership.create({ data: { userId: userId, conversationId: id } })

  return Response.json({ ok: true })
}
