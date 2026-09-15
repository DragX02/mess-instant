"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "./modal"
import type { Friend } from "./types"

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
    if (selected.includes(friendId)) {
      setSelected(selected.filter((id) => id !== friendId))
    } else {
      setSelected([...selected, friendId])
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "GROUP", name: name, memberIds: selected }),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    onCreated(data.id)
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
