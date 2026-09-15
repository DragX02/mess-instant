"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Friend, FriendsData } from "./types"

function FriendRow({ friend, children }: { friend: Friend; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
        {friend.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{friend.name}</p>
        <p className="truncate text-xs text-muted-foreground">{friend.email}</p>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

export function FriendsPanel({
  data,
  onChange,
  onMessage,
}: {
  data: FriendsData
  onChange: () => void
  onMessage: (userId: string) => void
}) {
  const [email, setEmail] = useState("")
  const [info, setInfo] = useState("")
  const [isError, setIsError] = useState(false)

  async function addFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await fetch("/api/amis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
    const result = await response.json()

    if (!response.ok) {
      setIsError(true)
      setInfo(result.error)
      return
    }

    setIsError(false)
    setInfo("Demande d'ami envoyée !")
    setEmail("")
    onChange()
  }

  async function accept(friendshipId: string) {
    await fetch("/api/amis/" + friendshipId, { method: "PATCH" })
    onChange()
  }

  async function remove(friendshipId: string, question: string) {
    if (!confirm(question)) {
      return
    }
    await fetch("/api/amis/" + friendshipId, { method: "DELETE" })
    onChange()
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <section>
          <h2 className="mb-2 font-semibold">Ajouter un ami</h2>
          <form onSubmit={addFriend} className="flex gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@exemple.com"
            />
            <Button type="submit">Envoyer</Button>
          </form>
          {info && (
            <p className={`mt-2 text-sm ${isError ? "text-destructive" : "text-primary"}`}>
              {info}
            </p>
          )}
        </section>

        {data.received.length > 0 && (
          <section>
            <h2 className="mb-2 font-semibold">Demandes reçues ({data.received.length})</h2>
            <div className="flex flex-col gap-2">
              {data.received.map((friend) => (
                <FriendRow key={friend.friendshipId} friend={friend}>
                  <Button size="sm" onClick={() => accept(friend.friendshipId)}>
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(friend.friendshipId, "Refuser cette demande ?")}
                  >
                    Refuser
                  </Button>
                </FriendRow>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-2 font-semibold">Mes amis ({data.friends.length})</h2>
          {data.friends.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Vous n&apos;avez pas encore d&apos;amis.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {data.friends.map((friend) => (
              <FriendRow key={friend.friendshipId} friend={friend}>
                <Button size="sm" onClick={() => onMessage(friend.id)}>
                  Message
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(friend.friendshipId, "Retirer " + friend.name + " ?")}
                >
                  Retirer
                </Button>
              </FriendRow>
            ))}
          </div>
        </section>

        {data.sent.length > 0 && (
          <section>
            <h2 className="mb-2 font-semibold">Demandes envoyées</h2>
            <div className="flex flex-col gap-2">
              {data.sent.map((friend) => (
                <FriendRow key={friend.friendshipId} friend={friend}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(friend.friendshipId, "Annuler cette demande ?")}
                  >
                    Annuler
                  </Button>
                </FriendRow>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
