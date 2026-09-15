import type { Metadata } from "next"
import { createDefaultChannels, getCurrentUser } from "@/lib/chat"
import { ChatApp } from "@/components/chat/chat-app"

export const metadata: Metadata = {
  title: "Discussion - Helix",
}

export default async function DiscussionPage() {
  await createDefaultChannels()
  const user = await getCurrentUser()

  const currentUser = user
    ? { id: user.id, name: user.name || user.email, isAdmin: user.isAdmin }
    : null

  return <ChatApp user={currentUser} />
}
