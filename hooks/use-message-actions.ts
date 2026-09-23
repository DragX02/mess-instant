"use client"

import { useState } from "react"
import { api, apiSend } from "@/lib/api"

export function useMessageActions(onChange: () => void) {
  const [reactionMenu, setReactionMenu] = useState("")

  function toggleMenu(messageId: string) {
    setReactionMenu(reactionMenu === messageId ? "" : messageId)
  }

  async function react(messageId: string, emoji: string) {
    setReactionMenu("")
    await api("/api/messages/" + messageId + "/reactions", { method: "POST", body: { emoji } })
    onChange()
  }

  async function remove(messageId: string) {
    if (!confirm("Supprimer ce message ?")) {
      return
    }

    await apiSend("/api/messages/" + messageId, "DELETE")
    onChange()
  }

  return { reactionMenu, toggleMenu, react, remove }
}
