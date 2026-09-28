"use client"

import Link from "next/link"
import { pendingState } from "@/lib/conversations"
import type { ConversationItem, CurrentUser } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/ui/notice"

export function PendingBanners({
  conversation,
  user,
  onAccept,
  onDelete,
}: {
  conversation: ConversationItem | undefined
  user: CurrentUser | null
  onAccept: () => void
  onDelete: (question: string) => void
}) {
  const { pendingForMe, pendingByMe } = pendingState(conversation, user)

  if (pendingForMe) {
    return (
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-accent/40 px-4 py-3 text-sm">
        <span>
          <strong>{conversation?.name}</strong> souhaite vous envoyer des messages privés.
        </span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={onAccept}>
            Accepter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete("Refuser et supprimer cette conversation ?")}
          >
            Refuser
          </Button>
        </div>
      </div>
    )
  }

  if (pendingByMe) {
    return (
      <Notice variant="banner">
        Vous n&apos;êtes pas encore amis : {conversation?.name} doit accepter vos messages privés
        pour pouvoir vous répondre.
      </Notice>
    )
  }

  return null
}

export function ChatNotices({
  user,
  conversation,
  open,
  canWrite,
}: {
  user: CurrentUser | null
  conversation: ConversationItem | undefined
  open: boolean
  canWrite: boolean
}) {
  if (!user) {
    return (
      <Notice>
        Vous êtes visiteur : vous pouvez lire le canal #info de Helix.{" "}
        <Link href="/auth/connexion" className="text-primary hover:underline">
          Connectez-vous
        </Link>{" "}
        pour discuter.
      </Notice>
    )
  }

  if (canWrite) {
    return null
  }

  if (open && conversation?.type === "INFO") {
    return <Notice>Seuls les admins du serveur peuvent écrire dans #info.</Notice>
  }

  if (pendingState(conversation, user).pendingForMe) {
    return <Notice>Acceptez la demande pour pouvoir répondre.</Notice>
  }

  return null
}
