import { headers } from "next/headers"
import type { Conversation, User } from "@prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return null
  }

  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export async function createDefaultChannels() {
  await prisma.conversation.upsert({
    where: { id: "info" },
    update: {},
    create: { id: "info", type: "INFO", name: "info" },
  })

  await prisma.conversation.upsert({
    where: { id: "general" },
    update: {},
    create: { id: "general", type: "PUBLIC", name: "général" },
  })
}

export async function isMember(userId: string, conversationId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_conversationId: { userId, conversationId } },
  })

  return membership !== null
}

export async function canRead(conversation: Conversation, user: User | null) {
  if (conversation.type === "INFO") {
    return true
  }

  if (!user) {
    return false
  }

  if (conversation.type === "PUBLIC") {
    return true
  }

  return isMember(user.id, conversation.id)
}

export async function canWrite(conversation: Conversation, user: User | null) {
  if (!user) {
    return false
  }

  if (conversation.type === "INFO") {
    return user.isAdmin
  }

  if (conversation.type === "PUBLIC") {
    return true
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
