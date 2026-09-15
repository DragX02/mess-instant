import { prisma } from "@/lib/prisma"
import { areFriends, findPrivateConversation, getCurrentUser } from "@/lib/chat"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    const info = await prisma.conversation.findMany({ where: { type: "INFO" } })
    const result = info.map((conversation) => ({
      id: conversation.id,
      type: conversation.type,
      name: conversation.name,
      accepted: true,
      createdById: null,
      memberCount: 0,
    }))
    return Response.json(result)
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ type: "INFO" }, { type: "PUBLIC" }, { memberships: { some: { userId: user.id } } }],
    },
    include: {
      memberships: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: "asc" },
  })

  const result = conversations.map((conversation) => {
    let name = conversation.name

    if (conversation.type === "PRIVATE") {
      const other = conversation.memberships.find((membership) => membership.userId !== user.id)
      name = other ? other.user.name || other.user.email : "Conversation"
    }

    return {
      id: conversation.id,
      type: conversation.type,
      name: name,
      accepted: conversation.accepted,
      createdById: conversation.createdById,
      memberCount: conversation.memberships.length,
    }
  })

  return Response.json(result)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""

  if (body.type === "PUBLIC") {
    if (!user.isAdmin) {
      return Response.json({ error: "Seul un admin peut créer un canal." }, { status: 403 })
    }
    if (name === "") {
      return Response.json({ error: "Le nom est obligatoire." }, { status: 400 })
    }

    const channel = await prisma.conversation.create({
      data: { type: "PUBLIC", name: name, createdById: user.id },
    })
    return Response.json({ id: channel.id })
  }

  if (body.type === "GROUP") {
    if (name === "") {
      return Response.json({ error: "Le nom du groupe est obligatoire." }, { status: 400 })
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
      return Response.json({ error: "Utilisateur introuvable." }, { status: 404 })
    }
    if (target.id === user.id) {
      return Response.json(
        { error: "Vous ne pouvez pas vous écrire à vous-même." },
        { status: 400 },
      )
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

  return Response.json({ error: "Type de conversation inconnu." }, { status: 400 })
}
