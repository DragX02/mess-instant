import { prisma } from "@/lib/prisma"
import {
  CHAMPS_UTILISATEUR,
  areFriends,
  getCurrentUser,
  isMember,
  membresVisibles,
} from "@/lib/chat"
import { actionImpossible, erreur, nonConnecte, ok } from "@/lib/reponses"

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user || !(await isMember(user.id, id))) {
    return actionImpossible()
  }

  const memberships = await prisma.membership.findMany({
    where: { conversationId: id },
    include: { user: { select: CHAMPS_UTILISATEUR } },
    orderBy: { joinedAt: "asc" },
  })

  return Response.json(membresVisibles(memberships))
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || conversation.type !== "GROUP" || !(await isMember(user.id, id))) {
    return actionImpossible()
  }

  const body = await request.json()
  const userId = typeof body.userId === "string" ? body.userId : ""

  if (!(await areFriends(user.id, userId))) {
    return erreur("Vous ne pouvez ajouter que vos amis.", 400)
  }
  if (await isMember(userId, id)) {
    return erreur("Cette personne est déjà dans le groupe.", 400)
  }

  await prisma.membership.create({ data: { userId: userId, conversationId: id } })

  return ok()
}
