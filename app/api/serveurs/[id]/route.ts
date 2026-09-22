import { prisma } from "@/lib/prisma"
import { DEFAULT_SERVER_ID, getCurrentUser, serverRole } from "@/lib/chat"

/** Le propriétaire supprime le serveur ; un autre membre le quitte. */
export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const role = await serverRole(user.id, id)

  if (id === DEFAULT_SERVER_ID || role === null) {
    return Response.json({ error: "Action impossible." }, { status: 403 })
  }

  if (role === "OWNER") {
    await prisma.server.delete({ where: { id } })
  } else {
    await prisma.serverMember.delete({
      where: { userId_serverId: { userId: user.id, serverId: id } },
    })
  }

  return Response.json({ ok: true })
}
