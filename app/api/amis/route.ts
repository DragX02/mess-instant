import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/chat"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: user.id }, { receiverId: user.id }] },
    include: {
      requester: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  const friends = []
  const received = []
  const sent = []

  for (const friendship of friendships) {
    const other = friendship.requesterId === user.id ? friendship.receiver : friendship.requester
    const item = {
      friendshipId: friendship.id,
      id: other.id,
      name: other.name || other.email,
      email: other.email,
    }

    if (friendship.accepted) {
      friends.push(item)
    } else if (friendship.receiverId === user.id) {
      received.push(item)
    } else {
      sent.push(item)
    }
  }

  return Response.json({ friends, received, sent })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const body = await request.json()
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const target = await prisma.user.findUnique({ where: { email } })

  if (!target) {
    return Response.json({ error: "Aucun utilisateur avec cet email." }, { status: 404 })
  }
  if (target.id === user.id) {
    return Response.json({ error: "Vous ne pouvez pas vous ajouter vous-même." }, { status: 400 })
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: user.id, receiverId: target.id },
        { requesterId: target.id, receiverId: user.id },
      ],
    },
  })

  if (existing) {
    if (existing.accepted) {
      return Response.json({ error: "Vous êtes déjà amis." }, { status: 400 })
    }
    if (existing.requesterId === user.id) {
      return Response.json({ error: "Demande déjà envoyée." }, { status: 400 })
    }
    return Response.json(
      { error: "Cette personne vous a déjà envoyé une demande, acceptez-la." },
      { status: 400 },
    )
  }

  await prisma.friendship.create({ data: { requesterId: user.id, receiverId: target.id } })

  return Response.json({ ok: true })
}
