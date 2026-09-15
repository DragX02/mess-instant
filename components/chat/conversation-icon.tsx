import { Hash, Megaphone, MessageCircle, Users } from "lucide-react"
import type { ConversationType } from "@/lib/types"

const ICONS = {
  INFO: Megaphone,
  PUBLIC: Hash,
  GROUP: Users,
  PRIVATE: MessageCircle,
}

export function ConversationIcon({ type }: { type: ConversationType }) {
  const Icon = ICONS[type]
  return <Icon className="h-4 w-4 shrink-0" />
}
