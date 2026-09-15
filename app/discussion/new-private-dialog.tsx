"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "./modal"
import type { Friend } from "./types"

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

  async function openConversation(body: { userId?: string; email?: string }) {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PRIVATE", ...body }),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    onCreated(data.id)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    openConversation({ email: email })
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
