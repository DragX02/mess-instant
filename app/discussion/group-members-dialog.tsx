"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "./modal"
import type { Friend } from "./types"

type Member = {
  id: string
  name: string
  role: string
}

export function GroupMembersDialog({
  conversationId,
  friends,
  onClose,
  onChange,
}: {
  conversationId: string
  friends: Friend[]
  onClose: () => void
  onChange: () => void
}) {
  const [members, setMembers] = useState<Member[]>([])
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/conversations/" + conversationId + "/membres")
      if (response.ok) {
        setMembers(await response.json())
      }
    }

    load()
  }, [conversationId, refresh])

  async function addMember(userId: string) {
    const response = await fetch("/api/conversations/" + conversationId + "/membres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setError("")
    setRefresh(refresh + 1)
    onChange()
  }

  const friendsNotInGroup = friends.filter(
    (friend) => !members.some((member) => member.id === friend.id),
  )

  return (
    <Modal title="Membres du groupe" onClose={onClose}>
      <div className="flex flex-col gap-1">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 truncate">{member.name}</span>
            {member.role === "OWNER" && <span className="text-xs text-primary">Créateur</span>}
          </div>
        ))}
      </div>

      {friendsNotInGroup.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-sm font-medium">Ajouter un ami</p>
          <div className="flex flex-col gap-1">
            {friendsNotInGroup.map((friend) => (
              <div key={friend.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                <span className="flex-1 truncate">{friend.name}</span>
                <Button size="sm" variant="outline" onClick={() => addMember(friend.id)}>
                  Ajouter
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </Modal>
  )
}
