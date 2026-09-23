"use client"

import { useRef, type RefObject } from "react"
import { Mic, Paperclip, X } from "lucide-react"
import { cn } from "cn"
import { EMOJIS } from "@/lib/emojis"
import { formatDuration } from "@/lib/format"
import { useMessageDraft } from "@/hooks/use-message-draft"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"
import { MessageBar } from "./message-bar"
import { launchBubble } from "./space/launch-bubble"
import { UserStar } from "./space/user-star"

export function MessageForm({
  conversationId,
  placeholder,
  userName,
  planetRef,
  onSent,
}: {
  conversationId: string
  placeholder: string
  userName: string
  planetRef: RefObject<HTMLElement | null>
  onSent: () => void
}) {
  const bubbleRef = useRef<HTMLDivElement>(null)

  const draft = useMessageDraft(conversationId, onSent, async () => {
    if (bubbleRef.current && planetRef.current) {
      await launchBubble(bubbleRef.current, planetRef.current)
    }
  })

  const recorder = draft.recorder
  const showBubble = draft.hasDraft || recorder.recording || draft.vocalSeconds > 0

  return (
    <div className="relative shrink-0 px-3 pt-2 pb-3">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="relative">
          {showBubble && (
            <div
              ref={bubbleRef}
              className={cn(
                "absolute bottom-full left-2 mb-3 w-max max-w-[min(20rem,70vw)] animate-bubble-in rounded-2xl rounded-bl-sm border border-amber-200/40 bg-amber-100/15 px-3 py-2 text-sm text-white shadow-[0_0_24px_rgba(255,209,102,0.35)] backdrop-blur-md",
                draft.sending && "invisible",
              )}
            >
              {recorder.recording || draft.vocalSeconds > 0 ? (
                <div className="flex items-center gap-2 text-amber-100">
                  <Mic className="h-4 w-4 shrink-0" />
                  <span className="font-mono">
                    {formatDuration(recorder.recording ? recorder.seconds : draft.vocalSeconds)}
                  </span>
                </div>
              ) : (
                <>
                  {draft.text.trim() !== "" && (
                    <p className="line-clamp-4 wrap-break-word whitespace-pre-wrap">{draft.text}</p>
                  )}
                  {draft.file && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-amber-100">
                      <Paperclip className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{draft.file.name}</span>
                      <IconButton
                        label="Retirer le fichier"
                        onClick={draft.removeFile}
                        className="p-0 text-amber-100 hover:bg-transparent hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <UserStar name={userName} />
        </div>

        <div className="min-w-0 flex-1 pb-5">
          {draft.message && <p className="mb-2 text-sm text-red-300">{draft.message}</p>}

          {draft.showEmojis && !recorder.recording && (
            <EmojiPicker
              emojis={EMOJIS}
              onSelect={(emoji) => draft.setText(draft.text + emoji)}
              className="mb-2"
            />
          )}

          <MessageBar draft={draft} placeholder={placeholder} tone="sombre" />
        </div>
      </div>
    </div>
  )
}
