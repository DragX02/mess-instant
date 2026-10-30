"use client"

import { useRef } from "react"
import { Mic, Paperclip, Send, Smile, Trash2 } from "lucide-react"
import { cn } from "cn"
import { formatDuration } from "@/lib/format"
import type { MessageDraft } from "@/hooks/use-message-draft"
import { IconButton } from "@/components/ui/icon-button"

const tones = {
  clair: {
    bar: "bg-muted/60",
    icon: "hover:bg-transparent",
    input: "placeholder:text-muted-foreground",
    hint: "text-muted-foreground",
    dot: "bg-destructive",
    active: "text-primary",
    trash: "hover:bg-transparent hover:text-destructive",
  },
  sombre: {
    bar: "border border-white/15 bg-white/10 text-white backdrop-blur-md",
    icon: "text-white/70 hover:bg-transparent hover:text-white",
    input: "placeholder:text-white/50",
    hint: "text-white/60",
    dot: "bg-red-400",
    active: "text-amber-200",
    trash: "text-white/70 hover:bg-transparent hover:text-red-300",
  },
}

const SEND_BUTTON =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"

export function MessageBar({
  draft,
  placeholder,
  tone,
}: {
  draft: MessageDraft
  placeholder: string
  tone: keyof typeof tones
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const style = tones[tone]
  const recorder = draft.recorder

  if (recorder.recording) {
    return (
      <div className={cn("flex items-center gap-3 rounded-full px-3 py-2", style.bar)}>
        <span className={cn("h-2.5 w-2.5 shrink-0 animate-pulse rounded-full", style.dot)} />
        <span className="font-mono text-sm">{formatDuration(recorder.seconds)}</span>
        <span className={cn("min-w-0 flex-1 truncate text-sm", style.hint)}>
          Enregistrement en cours…
        </span>

        <IconButton
          label="Annuler l'enregistrement"
          onClick={recorder.cancel}
          className={cn("p-0", style.trash)}
        >
          <Trash2 className="h-5 w-5" />
        </IconButton>

        <button
          type="button"
          onClick={recorder.stop}
          aria-label="Envoyer le vocal"
          className={SEND_BUTTON}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={draft.handleSubmit}
      className={cn("flex items-center gap-2 rounded-full px-3 py-2", style.bar)}
    >
      <input ref={fileInput} type="file" className="hidden" onChange={draft.chooseFile} />

      <IconButton
        label="Joindre un fichier"
        onClick={() => fileInput.current?.click()}
        className={cn("p-0", style.icon)}
      >
        <Paperclip className="h-5 w-5" />
      </IconButton>

      <input
        value={draft.text}
        onChange={(event) => draft.setText(event.target.value)}
        placeholder={placeholder}
        maxLength={4000}
        className={cn("min-w-0 flex-1 bg-transparent text-sm outline-none", style.input)}
      />

      <IconButton
        label="Choisir un emoji"
        onClick={() => draft.setShowEmojis(!draft.showEmojis)}
        className={cn("p-0", style.icon, draft.showEmojis && style.active)}
      >
        <Smile className="h-5 w-5" />
      </IconButton>

      {!draft.hasDraft && (
        <IconButton
          label="Enregistrer un message vocal"
          onClick={draft.startRecording}
          disabled={draft.sending}
          className={cn("p-0 disabled:opacity-50", style.icon)}
        >
          <Mic className="h-5 w-5" />
        </IconButton>
      )}

      <button
        type="submit"
        disabled={draft.sending || !draft.hasDraft}
        aria-label="Envoyer"
        className={SEND_BUTTON}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  )
}
