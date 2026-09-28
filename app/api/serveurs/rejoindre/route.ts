import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/chat"
import { erreur, nonConnecte } from "@/lib/reponses"

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const body = await request.json()
  const code = typeof body.code === "string" ? body.code.trim() : ""
  const server = code
    ? await prisma.server.findFirst({
        where: { inviteCode: { equals: code, mode: "insensitive" } },
      })
    : null

  if (!server) {
    return erreur("Code d'invitation invalide.", 404)
  }

  await prisma.serverMember.upsert({
    where: { userId_serverId: { userId: user.id, serverId: server.id } },
    update: {},
    create: { userId: user.id, serverId: server.id },
  })

  return Response.json({ id: server.id })
}
