import { headers } from "next/headers"
import { connection } from "next/server"
import type { Conversation, User } from "@prisma/client"
import { auth } from "@/lib/auth"
import { DEFAULT_SERVER_ID } from "@/lib/galaxies"
import { prisma } from "@/lib/prisma"

export { DEFAULT_SERVER_ID }

type PersonneVisible = { id: string; name: string | null; email: string }

export const CHAMPS_UTILISATEUR = { id: true, name: true, email: true }

export function nomAffiche(user: PersonneVisible) {
  return user.name || user.email
}

export function membresVisibles(membres: { role: string; user: PersonneVisible }[]) {
  return membres.map((membre) => ({
    id: membre.user.id,
    name: nomAffiche(membre.user),
    role: membre.role,
  }))
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return null
  }

  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function createDefaultChannels() {
  await connection()

  await prisma.server.upsert({
    where: { id: DEFAULT_SERVER_ID },
    update: {},
    create: { id: DEFAULT_SERVER_ID, name: "Helix", inviteCode: DEFAULT_SERVER_ID },
  })

  await prisma.conversation.upsert({
    where: { id: "info" },
    update: {},
    create: { id: "info", type: "INFO", name: "info", serverId: DEFAULT_SERVER_ID },
  })

  await prisma.conversation.upsert({
    where: { id: "general" },
    update: {},
    create: { id: "general", type: "PUBLIC", name: "général", serverId: DEFAULT_SERVER_ID },
  })
}

export async function joinDefaultServer(user: User) {
  await prisma.serverMember.upsert({
    where: { userId_serverId: { userId: user.id, serverId: DEFAULT_SERVER_ID } },
    update: {},
    create: {
      userId: user.id,
      serverId: DEFAULT_SERVER_ID,
      role: user.isAdmin ? "ADMIN" : "MEMBER",
    },
  })
}

export async function serverRole(userId: string, serverId: string) {
  const member = await prisma.serverMember.findUnique({
    where: { userId_serverId: { userId, serverId } },
  })

  return member ? member.role : null
}

export async function canManageServer(user: User, serverId: string) {
  if (user.isAdmin) {
    return true
  }

  const role = await serverRole(user.id, serverId)
  return role === "OWNER" || role === "ADMIN"
}

export function newInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")
}

export async function isMember(userId: string, conversationId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_conversationId: { userId, conversationId } },
  })

  return membership !== null
}

export async function canRead(conversation: Conversation, user: User | null) {
  if (conversation.serverId) {
    if (conversation.serverId === DEFAULT_SERVER_ID && conversation.type === "INFO") {
      return true
    }
    return user !== null && (await serverRole(user.id, conversation.serverId)) !== null
  }

  if (!user) {
    return false
  }

  return isMember(user.id, conversation.id)
}

export async function canWrite(conversation: Conversation, user: User | null) {
  if (!user) {
    return false
  }

  if (conversation.serverId) {
    if (conversation.type === "INFO") {
      return canManageServer(user, conversation.serverId)
    }
    return (await serverRole(user.id, conversation.serverId)) !== null
  }

  const member = await isMember(user.id, conversation.id)

  if (!member) {
    return false
  }

  if (conversation.type === "PRIVATE" && !conversation.accepted) {
    return conversation.createdById === user.id
  }

  return true
}

export async function areFriends(userId: string, otherUserId: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      accepted: true,
      OR: [
        { requesterId: userId, receiverId: otherUserId },
        { requesterId: otherUserId, receiverId: userId },
      ],
    },
  })

  return friendship !== null
}

export async function findPrivateConversation(userId: string, otherUserId: string) {
  return prisma.conversation.findFirst({
    where: {
      type: "PRIVATE",
      AND: [
        { memberships: { some: { userId: userId } } },
        { memberships: { some: { userId: otherUserId } } },
      ],
    },
  })
}
