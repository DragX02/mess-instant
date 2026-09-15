"use client"

import { useState, type SubmitEvent } from "react"
import { api } from "@/lib/api"
import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"

export function NewGroupDialog({
  friends,
  onClose,
  onCreated,
}: {
  friends: Friend[]
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [name, setName] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState("")

  function toggle(friendId: string) {
    setSelected((current) =>
      current.includes(friendId) ? current.filter((id) => id !== friendId) : [...current, friendId],
    )
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await api<{ id: string }>("/api/conversations", {
      method: "POST",
      body: { type: "GROUP", name, memberIds: selected },
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    onCreated(result.data.id)
  }

  return (
    <Modal title="Nouveau groupe" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="group-name">Nom du groupe</Label>
          <Input
            id="group-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Les copains"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Ajouter des amis</Label>
          {friends.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Vous n&apos;avez pas encore d&apos;amis. Vous pourrez en ajouter plus tard.
            </p>
          )}
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
            {friends.map((friend) => (
              <label
                key={friend.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(friend.id)}
                  onChange={() => toggle(friend.id)}
                />
                {friend.name}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit">Créer le groupe</Button>
      </form>
    </Modal>
  )
}
