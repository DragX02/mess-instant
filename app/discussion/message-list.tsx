"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Download, File, SmilePlus, Trash2 } from "lucide-react"
import type { CurrentUser, MessageItem } from "./types"

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"]

function formatDate(date: string) {
  const messageDate = new Date(date)
  const time = messageDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  if (messageDate.toDateString() === new Date().toDateString()) {
    return "Aujourd'hui à " + time
  }

  return messageDate.toLocaleDateString("fr-FR") + " à " + time
}

function FilePreview({ message }: { message: MessageItem }) {
  const url = message.fileUrl || ""
  const type = message.fileType || ""
  const name = message.fileName || "fichier"

  if (type.startsWith("image/") && type !== "image/svg+xml") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="mt-2 block w-fit">
        <Image
          src={url}
          alt={name}
          width={320}
          height={240}
          unoptimized
          className="h-auto max-h-64 w-auto max-w-full rounded-md border border-border"
        />
      </a>
    )
  }

  if (type.startsWith("video/")) {
    return <video src={url} controls className="mt-2 max-h-64 max-w-full rounded-md" />
  }

  if (type.startsWith("audio/")) {
    return <audio src={url} controls className="mt-2 max-w-full" />
  }

  return (
    <a
      href={url}
      className="mt-2 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm hover:bg-muted"
    >
      <File className="h-4 w-4 shrink-0" />
      <span className="truncate">{name}</span>
      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  )
}

export function MessageList({
  messages,
  user,
  onChange,
}: {
  messages: MessageItem[]
  user: CurrentUser | null
  onChange: () => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [reactionMenu, setReactionMenu] = useState("")

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView()
    }
  }, [messages.length])

  async function react(messageId: string, emoji: string) {
    setReactionMenu("")
    await fetch("/api/messages/" + messageId + "/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji: emoji }),
    })
    onChange()
  }

  async function remove(messageId: string) {
    if (!confirm("Supprimer ce message ?")) {
      return
    }
    await fetch("/api/messages/" + messageId, { method: "DELETE" })
    onChange()
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-sm text-muted-foreground">
        Aucun message pour le moment.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="group relative flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {message.sender.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold">{message.sender.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {formatDate(message.createdAt)}
              </span>
            </div>

            {message.content && (
              <p className="text-sm break-words whitespace-pre-wrap text-foreground/90">
                {message.content}
              </p>
            )}

            {message.fileUrl && <FilePreview message={message} />}

            {message.reactions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    disabled={!user}
                    onClick={() => react(message.id, reaction.emoji)}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                      reaction.mine
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/60"
                    }`}
                  >
                    {reaction.emoji} {reaction.count}
                  </button>
                ))}
              </div>
            )}

            {reactionMenu === message.id && (
              <div className="mt-1 flex w-fit gap-1 rounded-lg border border-border bg-card p-1 shadow">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => react(message.id, emoji)}
                    className="rounded p-1 text-lg hover:bg-muted"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && (
            <div className="absolute -top-3 right-2 flex gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              <button
                onClick={() => setReactionMenu(reactionMenu === message.id ? "" : message.id)}
                aria-label="Réagir"
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <SmilePlus className="h-4 w-4" />
              </button>
              {(message.sender.id === user.id || user.isAdmin) && (
                <button
                  onClick={() => remove(message.id)}
                  aria-label="Supprimer le message"
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
