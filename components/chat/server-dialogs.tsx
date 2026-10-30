"use client"

import { useState, type SubmitEvent } from "react"
import { Check, Copy } from "lucide-react"
import { api } from "@/lib/api"
import type { ServerItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"

export function ServerDialog({
  mode,
  onClose,
  onDone,
}: {
  mode: "creer" | "rejoindre"
  onClose: () => void
  onDone: (serverId: string) => void
}) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const creating = mode === "creer"

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = await api<{ id: string }>(
      creating ? "/api/serveurs" : "/api/serveurs/rejoindre",
      { method: "POST", body: creating ? { name: value } : { code: value } },
    )

    if (!result.ok) {
      setError(result.error)
      return
    }

    onDone(result.data.id)
  }

  return (
    <Modal title={creating ? "Créer un serveur" : "Rejoindre un serveur"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {creating
            ? "Votre serveur deviendra une nouvelle galaxie, avec son soleil #info et un premier canal #général."
            : "Entrez le code d'invitation que vous a donné un membre du serveur."}
        </p>

        <Field label={creating ? "Nom du serveur" : "Code d'invitation"} htmlFor="server-value">
          <Input
            id="server-value"
            required
            autoFocus
            maxLength={creating ? 50 : 20}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={creating ? "Club d'astronomie" : "K7P2QX9M"}
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit">{creating ? "Créer le serveur" : "Rejoindre"}</Button>
      </form>
    </Modal>
  )
}

export function InviteDialog({ server, onClose }: { server: ServerItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(server.inviteCode)
      setCopied(true)
    } catch {}
  }

  return (
    <Modal title={"Inviter dans " + server.name} onClose={onClose}>
      <p className="mb-3 text-sm text-muted-foreground">
        Partagez ce code : il suffit de cliquer sur « Rejoindre » dans l&apos;univers et de le
        saisir.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-center font-mono text-lg tracking-widest select-all">
          {server.inviteCode}
        </code>
        <Button variant="outline" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
    </Modal>
  )
}
