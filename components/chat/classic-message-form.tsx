"use client"

import { Paperclip, X } from "lucide-react"
import { EMOJIS } from "@/lib/emojis"
import { useMessageDraft } from "@/hooks/use-message-draft"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"
import { MessageBar } from "./message-bar"

export function ClassicMessageForm({
  conversationId,
  placeholder,
  onSent,
}: {
  conversationId: string
  placeholder: string
  onSent: () => void
}) {
  const draft = useMessageDraft(conversationId, onSent)
  const recording = draft.recorder.recording

  return (
    <div className="shrink-0 border-t border-border p-3">
      {draft.message && <p className="mb-2 text-sm text-destructive">{draft.message}</p>}

      {draft.file && !recording && (
        <div className="mb-2 flex w-fit max-w-full items-center gap-2 rounded-md border border-border bg-muted/60 px-2 py-1 text-sm">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">{draft.file.name}</span>
          <IconButton label="Retirer le fichier" onClick={draft.removeFile} className="p-0">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      {draft.showEmojis && !recording && (
        <EmojiPicker
          emojis={EMOJIS}
          onSelect={(emoji) => draft.setText(draft.text + emoji)}
          className="mb-2"
        />
      )}

      <MessageBar draft={draft} placeholder={placeholder} tone="clair" />
    </div>
  )
}
