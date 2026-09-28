import { prisma } from "@/lib/prisma"
import { CHAMPS_UTILISATEUR, getCurrentUser, membresVisibles, serverRole } from "@/lib/chat"
import { actionImpossible } from "@/lib/reponses"

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user || (await serverRole(user.id, id)) === null) {
    return actionImpossible()
  }

  const members = await prisma.serverMember.findMany({
    where: { serverId: id },
    include: { user: { select: CHAMPS_UTILISATEUR } },
    orderBy: { joinedAt: "asc" },
  })

  return Response.json(membresVisibles(members))
}
