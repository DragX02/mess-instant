"use client"

import { useEffect, useRef } from "react"
import { cn } from "cn"
import { QUICK_REACTIONS } from "@/lib/emojis"
import { formatMessageDate } from "@/lib/format"
import type { CurrentUser, MessageItem } from "@/lib/types"
import { useMessageActions } from "@/hooks/use-message-actions"
import { EmojiPicker } from "./emoji-picker"
import { FilePreview } from "./file-preview"
import { MessageTools, ReactionList } from "./message-tools"

export function MessageList({
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
  const listRef = useRef<HTMLDivElement>(null)
  const actions = useMessageActions(onChange)

  useEffect(() => {
    const list = listRef.current
    if (list) {
      list.scrollTop = list.scrollHeight
    }
  }, [messages.length])

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
                  audioDuration={message.audioDuration}
                />
              )}

              <time
                dateTime={message.createdAt}
                className="mt-1 block text-right font-mono text-[10px] opacity-70"
              >
                {formatMessageDate(message.createdAt)}
              </time>

              {user && (
                <MessageTools
                  className={mine ? "left-2" : "right-2"}
                  canDelete={mine || canModerate}
                  onReact={() => actions.toggleMenu(message.id)}
                  onRemove={() => actions.remove(message.id)}
                />
              )}
            </div>

            <ReactionList
              reactions={message.reactions}
              disabled={!user}
              tone="sombre"
              onReact={(emoji) => actions.react(message.id, emoji)}
            />

            {actions.reactionMenu === message.id && (
              <EmojiPicker
                variant="row"
                emojis={QUICK_REACTIONS}
                onSelect={(emoji) => actions.react(message.id, emoji)}
                className="mt-1 shadow"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
