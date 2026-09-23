"use client"

import { useEffect, useRef, useState } from "react"
import { SmilePlus, Trash2 } from "lucide-react"
import { cn } from "cn"
import { api, apiSend } from "@/lib/api"
import { QUICK_REACTIONS } from "@/lib/emojis"
import { formatMessageDate } from "@/lib/format"
import type { CurrentUser, MessageItem } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"
import { FilePreview } from "./file-preview"

export function ClassicMessageList({
  messages,
  user,
  canModerate,
  onChange,
}: {
  messages: MessageItem[]
  user: CurrentUser | null
  canModerate: boolean
  onChange: () => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [reactionMenu, setReactionMenu] = useState("")

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages.length])

  async function react(messageId: string, emoji: string) {
    setReactionMenu("")
    await api("/api/messages/" + messageId + "/reactions", { method: "POST", body: { emoji } })
    onChange()
  }

  async function remove(messageId: string) {
    if (!confirm("Supprimer ce message ?")) {
      return
    }
    await apiSend("/api/messages/" + messageId, "DELETE")
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
          <Avatar name={message.sender.name} size="lg" tone="primary" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold">{message.sender.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {formatMessageDate(message.createdAt)}
              </span>
            </div>

            {message.content && (
              <p className="text-sm wrap-break-word whitespace-pre-wrap text-foreground/90">
                {message.content}
              </p>
            )}

            {message.fileUrl && (
              <FilePreview
                url={message.fileUrl}
                name={message.fileName || "fichier"}
                type={message.fileType || ""}
                audioDuration={message.audioDuration}
                tone="clair"
              />
            )}

            {message.reactions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    disabled={!user}
                    onClick={() => react(message.id, reaction.emoji)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                      reaction.mine
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/60",
                    )}
                  >
                    {reaction.emoji} {reaction.count}
                  </button>
                ))}
              </div>
            )}

            {reactionMenu === message.id && (
              <EmojiPicker
                variant="row"
                emojis={QUICK_REACTIONS}
                onSelect={(emoji) => react(message.id, emoji)}
                className="mt-1 shadow"
              />
            )}
          </div>

          {user && (
            <div className="absolute -top-3 right-2 flex gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              <IconButton
                label="Réagir"
                onClick={() => setReactionMenu(reactionMenu === message.id ? "" : message.id)}
                className="rounded"
              >
                <SmilePlus className="h-4 w-4" />
              </IconButton>
              {(message.sender.id === user.id || canModerate) && (
                <IconButton
                  label="Supprimer le message"
                  onClick={() => remove(message.id)}
                  className="rounded hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
