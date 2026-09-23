import { prisma } from "@/lib/prisma"
import {
  CHAMPS_UTILISATEUR,
  DEFAULT_SERVER_ID,
  areFriends,
  canManageServer,
  findPrivateConversation,
  getCurrentUser,
  nomAffiche,
} from "@/lib/chat"
import { erreur, nonConnecte } from "@/lib/reponses"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    const info = await prisma.conversation.findMany({
      where: { type: "INFO", serverId: DEFAULT_SERVER_ID },
    })
    const result = info.map((conversation) => ({
      id: conversation.id,
      type: conversation.type,
      name: conversation.name,
      accepted: true,
      createdById: null,
      memberCount: 0,
      serverId: conversation.serverId,
    }))
    return Response.json(result)
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { server: { members: { some: { userId: user.id } } } },
        { memberships: { some: { userId: user.id } } },
      ],
    },
    include: {
      memberships: { include: { user: { select: CHAMPS_UTILISATEUR } } },
    },
    orderBy: { createdAt: "asc" },
  })

  const result = conversations.map((conversation) => {
    let name = conversation.name

    if (conversation.type === "PRIVATE") {
      const other = conversation.memberships.find((membership) => membership.userId !== user.id)
      name = other ? nomAffiche(other.user) : "Conversation"
    }

    return {
      id: conversation.id,
      type: conversation.type,
      name: name,
      accepted: conversation.accepted,
      createdById: conversation.createdById,
      memberCount: conversation.memberships.length,
      serverId: conversation.serverId,
    }
  })

  return Response.json(result)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""

  if (body.type === "PUBLIC") {
    const serverId = typeof body.serverId === "string" ? body.serverId : DEFAULT_SERVER_ID
    const server = await prisma.server.findUnique({ where: { id: serverId } })

    if (!server || !(await canManageServer(user, serverId))) {
      return erreur("Seuls les admins du serveur peuvent créer un canal.", 403)
    }
    if (name === "") {
      return erreur("Le nom est obligatoire.", 400)
    }

    const channel = await prisma.conversation.create({
      data: { type: "PUBLIC", name: name, createdById: user.id, serverId },
    })
    return Response.json({ id: channel.id })
  }

  if (body.type === "GROUP") {
    if (name === "") {
      return erreur("Le nom du groupe est obligatoire.", 400)
    }

    const memberIds: string[] = Array.isArray(body.memberIds) ? body.memberIds : []
    const friendIds: string[] = []

    for (const memberId of memberIds) {
      if (memberId !== user.id && (await areFriends(user.id, memberId))) {
        friendIds.push(memberId)
      }
    }

    const group = await prisma.conversation.create({
      data: {
        type: "GROUP",
        name: name,
        createdById: user.id,
        memberships: {
          create: [
            { userId: user.id, role: "OWNER" },
            ...friendIds.map((friendId) => ({ userId: friendId })),
          ],
        },
      },
    })
    return Response.json({ id: group.id })
  }

  if (body.type === "PRIVATE") {
    let target = null

    if (typeof body.userId === "string") {
      target = await prisma.user.findUnique({ where: { id: body.userId } })
    } else if (typeof body.email === "string") {
      target = await prisma.user.findUnique({ where: { email: body.email.trim().toLowerCase() } })
    }

    if (!target) {
      return erreur("Utilisateur introuvable.", 404)
    }
    if (target.id === user.id) {
      return erreur("Vous ne pouvez pas vous écrire à vous-même.", 400)
    }

    const existing = await findPrivateConversation(user.id, target.id)
    if (existing) {
      return Response.json({ id: existing.id })
    }

    const friends = await areFriends(user.id, target.id)

    const conversation = await prisma.conversation.create({
      data: {
        type: "PRIVATE",
        accepted: friends,
        createdById: user.id,
        memberships: { create: [{ userId: user.id }, { userId: target.id }] },
      },
    })
    return Response.json({ id: conversation.id })
  }

  return erreur("Type de conversation inconnu.", 400)
}
