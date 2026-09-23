import { prisma } from "@/lib/prisma"
import { CHAMPS_UTILISATEUR, getCurrentUser, nomAffiche } from "@/lib/chat"
import { erreur, nonConnecte, ok } from "@/lib/reponses"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: user.id }, { receiverId: user.id }] },
    include: {
      requester: { select: CHAMPS_UTILISATEUR },
      receiver: { select: CHAMPS_UTILISATEUR },
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
      name: nomAffiche(other),
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
    return nonConnecte()
  }

  const body = await request.json()
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const target = await prisma.user.findUnique({ where: { email } })

  if (!target) {
    return erreur("Aucun utilisateur avec cet email.", 404)
  }
  if (target.id === user.id) {
    return erreur("Vous ne pouvez pas vous ajouter vous-même.", 400)
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
      return erreur("Vous êtes déjà amis.", 400)
    }
    if (existing.requesterId === user.id) {
      return erreur("Demande déjà envoyée.", 400)
    }
    return erreur("Cette personne vous a déjà envoyé une demande, acceptez-la.", 400)
  }

  await prisma.friendship.create({ data: { requesterId: user.id, receiverId: target.id } })

  return ok()
}
