import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/chat"

/** Rejoint un serveur à partir de son code d'invitation. */
export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const body = await request.json()
  const code = typeof body.code === "string" ? body.code.trim() : ""
  const server = code
    ? await prisma.server.findFirst({
        where: { inviteCode: { equals: code, mode: "insensitive" } },
      })
    : null

  if (!server) {
    return Response.json({ error: "Code d'invitation invalide." }, { status: 404 })
  }

  await prisma.serverMember.upsert({
    where: { userId_serverId: { userId: user.id, serverId: server.id } },
    update: {},
    create: { userId: user.id, serverId: server.id },
  })

  return Response.json({ id: server.id })
}
