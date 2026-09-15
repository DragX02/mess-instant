"use client"

import { useState, type SubmitEvent } from "react"
import { api } from "@/lib/api"
import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"

export function NewPrivateDialog({
  friends,
  onClose,
  onCreated,
}: {
  friends: Friend[]
  onClose: () => void
  onCreated: (id: string) => void
}) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  async function openConversation(target: { userId?: string; email?: string }) {
    const result = await api<{ id: string }>("/api/conversations", {
      method: "POST",
      body: { type: "PRIVATE", ...target },
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    onCreated(result.data.id)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    openConversation({ email })
  }

  return (
    <Modal title="Nouveau message privé" onClose={onClose}>
      {friends.length > 0 && (
        <div className="mb-4 flex flex-col gap-1">
          <p className="text-sm font-medium">Vos amis</p>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => openConversation({ userId: friend.id })}
                className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                {friend.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="private-email">Ou écrire à quelqu&apos;un par email</Label>
          <Input
            id="private-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@exemple.com"
          />
          <p className="text-xs text-muted-foreground">
            Si vous n&apos;êtes pas amis, la personne devra accepter vos messages privés avant de
            pouvoir vous répondre.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit">Ouvrir la conversation</Button>
      </form>
    </Modal>
  )
}
