export type CurrentUser = {
  id: string
  name: string
  isAdmin: boolean
}

export type ConversationType = "INFO" | "PUBLIC" | "GROUP" | "PRIVATE"

export type ConversationItem = {
  id: string
  type: ConversationType
  name: string | null
  accepted: boolean
  createdById: string | null
  memberCount: number
  /** Serveur (galaxie) du canal ; null pour les groupes et messages privés. */
  serverId: string | null
}

export type ServerItem = {
  id: string
  name: string
  inviteCode: string
  /** null pour un visiteur, qui ne voit que le serveur par défaut. */
  role: "OWNER" | "ADMIN" | "MEMBER" | null
  canManage: boolean
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
  audioDuration: number | null
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

export type GroupMember = {
  id: string
  name: string
  role: string
}
