"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Friend, GroupMember } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { PersonRow } from "./person-row"

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
  const [members, setMembers] = useState<GroupMember[]>([])
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function load() {
      const result = await api<GroupMember[]>("/api/conversations/" + conversationId + "/membres")
      if (result.ok) {
        setMembers(result.data)
      }
    }

    load()
  }, [conversationId, refresh])

  async function addMember(userId: string) {
    const result = await api("/api/conversations/" + conversationId + "/membres", {
      method: "POST",
      body: { userId },
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    setError("")
    setRefresh((value) => value + 1)
    onChange()
  }

  const friendsNotInGroup = friends.filter(
    (friend) => !members.some((member) => member.id === friend.id),
  )

  return (
    <Modal title="Membres du groupe" onClose={onClose}>
      <div className="flex flex-col gap-2">
        {members.map((member) => (
          <PersonRow key={member.id} name={member.name}>
            {member.role === "OWNER" && <span className="text-xs text-primary">Créateur</span>}
          </PersonRow>
        ))}
      </div>

      {friendsNotInGroup.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-sm font-medium">Ajouter un ami</p>
          <div className="flex flex-col gap-2">
            {friendsNotInGroup.map((friend) => (
              <PersonRow key={friend.id} name={friend.name}>
                <Button size="sm" variant="outline" onClick={() => addMember(friend.id)}>
                  Ajouter
                </Button>
              </PersonRow>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </Modal>
  )
}
