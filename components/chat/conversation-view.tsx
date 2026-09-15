"use client"

import Link from "next/link"
import type { ConversationItem, CurrentUser, MessageItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Notice } from "@/components/ui/notice"
import { MessageForm } from "./message-form"
import { MessageList } from "./message-list"

function placeholderFor(conversation: ConversationItem | undefined) {
  if (!conversation) {
    return "Écrire un message"
  }
  if (conversation.type === "INFO" || conversation.type === "PUBLIC") {
    return "Écrire dans #" + conversation.name
  }
  return "Écrire à " + conversation.name
}

export function ConversationView({
  user,
  conversation,
  conversationId,
  messages,
  canWrite,
  onChange,
  onAccept,
  onDelete,
}: {
  user: CurrentUser | null
  conversation: ConversationItem | undefined
  conversationId: string
  messages: MessageItem[]
  canWrite: boolean
  onChange: () => void
  onAccept: () => void
  onDelete: (question: string) => void
}) {
  // Une conversation privée reste « en attente » tant que le destinataire n'a pas accepté.
  const isPending = conversation?.type === "PRIVATE" && !conversation.accepted
  const pendingForMe = isPending && user !== null && conversation.createdById !== user.id
  const pendingByMe = isPending && user !== null && conversation.createdById === user.id

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

      <MessageList messages={messages} user={user} onChange={onChange} />

      {!user && (
        <Notice>
          Vous êtes visiteur : vous pouvez lire le canal #info.{" "}
          <Link href="/auth/connexion" className="text-primary hover:underline">
            Connectez-vous
          </Link>{" "}
          pour discuter.
        </Notice>
      )}

      {user && canWrite && (
        <MessageForm
          key={conversationId}
          conversationId={conversationId}
          placeholder={placeholderFor(conversation)}
          onSent={onChange}
        />
      )}

      {user && !canWrite && conversation?.type === "INFO" && (
        <Notice>Seuls les administrateurs peuvent écrire dans #info.</Notice>
      )}

      {user && !canWrite && pendingForMe && (
        <Notice>Acceptez la demande pour pouvoir répondre.</Notice>
      )}
    </>
  )
}
