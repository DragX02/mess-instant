export type CurrentUser = {
  id: string
  name: string
  isAdmin: boolean
}

export type ConversationItem = {
  id: string
  type: "INFO" | "PUBLIC" | "GROUP" | "PRIVATE"
  name: string | null
  accepted: boolean
  createdById: string | null
  memberCount: number
}

export type ReactionItem = {
  emoji: string
  count: number
  mine: boolean
}

export type MessageItem = {
  id: string
  content: string
  fileUrl: string | null
  fileName: string | null
  fileType: string | null
  createdAt: string
  sender: { id: string; name: string }
  reactions: ReactionItem[]
}

export type Friend = {
  friendshipId: string
  id: string
  name: string
  email: string
}

export type FriendsData = {
  friends: Friend[]
  received: Friend[]
  sent: Friend[]
}
