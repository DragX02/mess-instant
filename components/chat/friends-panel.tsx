"use client"

import { useState, type SubmitEvent } from "react"
import { api, apiSend } from "@/lib/api"
import type { Friend, FriendsData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PersonRow } from "./person-row"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
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

  async function addFriend(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await api("/api/amis", { method: "POST", body: { email } })

    setIsError(!result.ok)

    if (!result.ok) {
      setInfo(result.error)
      return
    }

    setInfo("Demande d'ami envoyée !")
    setEmail("")
    onChange()
  }

  async function accept(friendshipId: string) {
    await apiSend("/api/amis/" + friendshipId, "PATCH")
    onChange()
  }

  async function remove(friendshipId: string, question: string) {
    if (!confirm(question)) {
      return
    }
    await apiSend("/api/amis/" + friendshipId, "DELETE")
    onChange()
  }

  function row(friend: Friend, actions: React.ReactNode) {
    return (
      <PersonRow key={friend.friendshipId} name={friend.name} subtitle={friend.email}>
        {actions}
      </PersonRow>
    )
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
          <Section title={"Demandes reçues (" + data.received.length + ")"}>
            {data.received.map((friend) =>
              row(
                friend,
                <>
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
                </>,
              ),
            )}
          </Section>
        )}

        <Section title={"Mes amis (" + data.friends.length + ")"}>
          {data.friends.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Vous n&apos;avez pas encore d&apos;amis.
            </p>
          )}
          {data.friends.map((friend) =>
            row(
              friend,
              <>
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
              </>,
            ),
          )}
        </Section>

        {data.sent.length > 0 && (
          <Section title="Demandes envoyées">
            {data.sent.map((friend) =>
              row(
                friend,
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(friend.friendshipId, "Annuler cette demande ?")}
                >
                  Annuler
                </Button>,
              ),
            )}
          </Section>
        )}
      </div>
    </div>
  )
}
