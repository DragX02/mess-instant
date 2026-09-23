"use client"

import Link from "next/link"
import { MessagesSquare } from "lucide-react"
import type { ConversationItem, CurrentUser, MessageItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/ui/notice"
import { ClassicMessageForm } from "./classic-message-form"
import { ClassicMessageList } from "./classic-message-list"

function placeholderFor(conversation: ConversationItem | undefined) {
  if (!conversation) {
    return "Écrire un message"
  }
  if (conversation.type === "INFO" || conversation.type === "PUBLIC") {
    return "Écrire dans #" + conversation.name
  }
  return "Écrire à " + conversation.name
}

/** Interface classique : une conversation à la fois, en liste verticale. */
export function ClassicView({
  user,
  conversation,
  conversationId,
  open,
  messages,
  canWrite,
  canModerate,
  onChange,
  onAccept,
  onDelete,
}: {
  user: CurrentUser | null
  conversation: ConversationItem | undefined
  conversationId: string
  open: boolean
  messages: MessageItem[]
  canWrite: boolean
  canModerate: boolean
  onChange: () => void
  onAccept: () => void
  onDelete: (question: string) => void
}) {
  // Une conversation privée reste « en attente » tant que le destinataire n'a pas accepté.
  const isPending = conversation?.type === "PRIVATE" && !conversation.accepted
  const pendingForMe = isPending && user !== null && conversation.createdById !== user.id
  const pendingByMe = isPending && user !== null && conversation.createdById === user.id

  if (!open || !conversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <MessagesSquare className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Choisissez une conversation dans le menu de gauche pour commencer.
        </p>
      </div>
    )
  }

  return (
    <>
      {pendingForMe && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-accent/40 px-4 py-3 text-sm">
          <span>
            <strong>{conversation.name}</strong> souhaite vous envoyer des messages privés.
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
      )}

      {pendingByMe && (
        <Notice variant="banner">
          Vous n&apos;êtes pas encore amis : {conversation.name} doit accepter vos messages privés
          pour pouvoir vous répondre.
        </Notice>
      )}

      <ClassicMessageList
        messages={messages}
        user={user}
        canModerate={canModerate}
        onChange={onChange}
      />

      {!user && (
        <Notice>
          Vous êtes visiteur : vous pouvez lire le canal #info de Helix.{" "}
          <Link href="/auth/connexion" className="text-primary hover:underline">
            Connectez-vous
          </Link>{" "}
          pour discuter.
        </Notice>
      )}

      {user && canWrite && (
        <ClassicMessageForm
          key={conversationId}
          conversationId={conversationId}
          placeholder={placeholderFor(conversation)}
          onSent={onChange}
        />
      )}

      {user && !canWrite && conversation?.type === "INFO" && (
        <Notice>Seuls les admins du serveur peuvent écrire dans #info.</Notice>
      )}

      {user && !canWrite && pendingForMe && (
        <Notice>Acceptez la demande pour pouvoir répondre.</Notice>
      )}
    </>
  )
}
