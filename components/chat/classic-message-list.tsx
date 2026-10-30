"use client"

import { useEffect, useRef } from "react"
import { QUICK_REACTIONS } from "@/lib/emojis"
import { formatMessageDate } from "@/lib/format"
import type { CurrentUser, MessageItem } from "@/lib/types"
import { useMessageActions } from "@/hooks/use-message-actions"
import { Avatar } from "@/components/ui/avatar"
import { EmojiPicker } from "./emoji-picker"
import { FilePreview } from "./file-preview"
import { MessageTools, ReactionList } from "./message-tools"

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
  const actions = useMessageActions(onChange)

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages.length])

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

            <ReactionList
              reactions={message.reactions}
              disabled={!user}
              tone="clair"
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

          {user && (
            <MessageTools
              className="right-2"
              canDelete={message.sender.id === user.id || canModerate}
              onReact={() => actions.toggleMenu(message.id)}
              onRemove={() => actions.remove(message.id)}
            />
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
