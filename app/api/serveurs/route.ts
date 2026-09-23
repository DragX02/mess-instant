import { prisma } from "@/lib/prisma"
import { DEFAULT_SERVER_ID, getCurrentUser, joinDefaultServer, newInviteCode } from "@/lib/chat"
import { erreur, nonConnecte } from "@/lib/reponses"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    const server = await prisma.server.findUnique({ where: { id: DEFAULT_SERVER_ID } })
    const result = server
      ? [
          {
            id: server.id,
            name: server.name,
            inviteCode: "",
            role: null,
            canManage: false,
            memberCount: 0,
          },
        ]
      : []
    return Response.json(result)
  }

  await joinDefaultServer(user)

  const memberships = await prisma.serverMember.findMany({
    where: { userId: user.id },
    include: { server: { include: { _count: { select: { members: true } } } } },
    orderBy: { joinedAt: "asc" },
  })

  const result = memberships.map((membership) => ({
    id: membership.server.id,
    name: membership.server.name,
    inviteCode: membership.server.inviteCode,
    role: membership.role,
    canManage: user.isAdmin || membership.role === "OWNER" || membership.role === "ADMIN",
    memberCount: membership.server._count.members,
  }))

  return Response.json(result)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""

  if (name === "" || name.length > 50) {
    return erreur("Le nom du serveur est obligatoire (50 caractères max).", 400)
  }

  const server = await prisma.server.create({
    data: {
      name,
      inviteCode: newInviteCode(),
      createdById: user.id,
      members: { create: { userId: user.id, role: "OWNER" } },
      conversations: {
        create: [
          { type: "INFO", name: "info", createdById: user.id },
          { type: "PUBLIC", name: "général", createdById: user.id },
        ],
      },
    },
  })

  return Response.json({ id: server.id })
}
