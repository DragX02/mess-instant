import type { Metadata } from "next"
import { createDefaultChannels, getCurrentUser } from "@/lib/chat"
import { ChatApp } from "./chat-app"

export const metadata: Metadata = {
  title: "Discussion - Helix",
}

export default async function DiscussionPage() {
  await createDefaultChannels()
  const user = await getCurrentUser()

  let currentUser = null
  if (user) {
    currentUser = { id: user.id, name: user.name || user.email, isAdmin: user.isAdmin }
  }

  return <ChatApp user={currentUser} />
}
