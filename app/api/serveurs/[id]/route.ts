import { prisma } from "@/lib/prisma"
import { DEFAULT_SERVER_ID, getCurrentUser, serverRole } from "@/lib/chat"
import { actionImpossible, nonConnecte, ok } from "@/lib/reponses"
import { membresServeur, publier } from "@/lib/temps-reel"

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const role = await serverRole(user.id, id)

  if (id === DEFAULT_SERVER_ID || role === null) {
    return actionImpossible()
  }

  const destinataires = await membresServeur(id)

  if (role === "OWNER") {
    await prisma.server.delete({ where: { id } })
  } else {
    await prisma.serverMember.delete({
      where: { userId_serverId: { userId: user.id, serverId: id } },
    })
  }

  publier(destinataires, { type: "donnees" })

  return ok()
}
