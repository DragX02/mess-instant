import { prisma } from "@/lib/prisma"
import { getCurrentUser, serverRole } from "@/lib/chat"

/** Membres d'un serveur, affichés en étoiles dans sa galaxie. */
export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user || (await serverRole(user.id, id)) === null) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  const members = await prisma.serverMember.findMany({
    where: { serverId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { joinedAt: "asc" },
  })

  const result = members.map((member) => ({
    id: member.user.id,
    name: member.user.name || member.user.email,
    role: member.role,
  }))

  return Response.json(result)
}
