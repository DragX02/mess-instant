"use client"

import { useEffect, useRef, useState } from "react"
import { SmilePlus, Trash2 } from "lucide-react"
import { cn } from "cn"
import { api, apiSend } from "@/lib/api"
import { QUICK_REACTIONS } from "@/lib/emojis"
import { formatMessageDate } from "@/lib/format"
import type { CurrentUser, MessageItem } from "@/lib/types"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"
import { FilePreview } from "./file-preview"

/** Messages affichés à l'intérieur de la planète : mes bulles à droite, les autres à gauche. */
export function MessageList({
  messages,
  user,
  canModerate,
  onChange,
}: {
  messages: MessageItem[]
  user: CurrentUser | null
  /** Admin du serveur (ou du site) : peut supprimer les messages des autres. */
  canModerate: boolean
  onChange: () => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [reactionMenu, setReactionMenu] = useState("")

  // On fait défiler la liste elle-même (et non la page) pour ne pas décaler la scène.
  useEffect(() => {
    const list = listRef.current
    if (list) {
      list.scrollTop = list.scrollHeight
    }
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
      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/70">
        Aucun message sur cette planète pour le moment.
      </div>
    )
  }

  return (
    <div ref={listRef} className="planet-fade h-full space-y-3 overflow-y-auto px-1 py-8">
      {messages.map((message) => {
        const mine = message.sender.id === user?.id

        return (
          <div
            key={message.id}
            className={cn("group relative flex flex-col", mine ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "relative max-w-[85%] rounded-2xl px-3 py-2 shadow-lg backdrop-blur-sm",
                mine
                  ? "rounded-br-sm bg-primary/90 text-primary-foreground"
                  : "rounded-bl-sm border border-white/15 bg-white/10 text-white",
              )}
            >
              {!mine && (
                <p className="text-xs font-semibold text-amber-200">{message.sender.name}</p>
              )}

              {message.content && (
                <p className="text-sm wrap-break-word whitespace-pre-wrap">{message.content}</p>
              )}

              {message.fileUrl && (
                <FilePreview
                  url={message.fileUrl}
                  name={message.fileName || "fichier"}
                  type={message.fileType || ""}
                />
              )}

              <time
                dateTime={message.createdAt}
                className="mt-1 block text-right font-mono text-[10px] opacity-70"
              >
                {formatMessageDate(message.createdAt)}
              </time>

              {user && (
                <div
                  className={cn(
                    "absolute -top-3 flex gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100",
                    mine ? "left-2" : "right-2",
                  )}
                >
                  <IconButton
                    label="Réagir"
                    onClick={() => setReactionMenu(reactionMenu === message.id ? "" : message.id)}
                    className="rounded"
                  >
                    <SmilePlus className="h-4 w-4" />
                  </IconButton>
                  {(mine || canModerate) && (
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

            {message.reactions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    disabled={!user}
                    onClick={() => react(message.id, reaction.emoji)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-white",
                      reaction.mine
                        ? "border-primary bg-primary/30"
                        : "border-white/15 bg-white/10",
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
        )
      })}
    </div>
  )
}
