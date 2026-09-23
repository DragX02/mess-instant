"use client"

import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react"
import { Mic, Paperclip, Send, Smile, Trash2, X } from "lucide-react"
import { cn } from "cn"
import { api } from "@/lib/api"
import { EMOJIS } from "@/lib/emojis"
import { formatDuration } from "@/lib/format"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function ClassicMessageForm({
  conversationId,
  placeholder,
  onSent,
}: {
  conversationId: string
  placeholder: string
  onSent: () => void
}) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const recorder = useAudioRecorder()

  const hasDraft = text.trim() !== "" || file !== null

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0] ?? null

    if (chosen && chosen.size > MAX_FILE_SIZE) {
      setError("Le fichier dépasse 10 Mo.")
      event.target.value = ""
      return
    }

    setError("")
    setFile(chosen)
  }

  function removeFile() {
    setFile(null)
    if (fileInput.current) {
      fileInput.current.value = ""
    }
  }

  async function send(content: string, joint: File | null, audioDuration: number) {
    const formData = new FormData()
    formData.append("content", content)

    if (joint) {
      formData.append("file", joint)
    }

    if (audioDuration > 0) {
      formData.append("audioDuration", String(audioDuration))
    }

    setSending(true)
    setError("")
    const result = await api("/api/conversations/" + conversationId + "/messages", {
      method: "POST",
      body: formData,
    })
    setSending(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setText("")
    removeFile()
    setShowEmojis(false)
    onSent()
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasDraft || sending) {
      return
    }

    await send(text, file, 0)
  }

  function startRecording() {
    setError("")
    recorder.start((vocal, seconds) => {
      if (vocal.size > MAX_FILE_SIZE) {
        setError("Le message vocal dépasse 10 Mo.")
        return
      }

      send("", vocal, seconds)
    })
  }

  const message = error || recorder.error

  return (
    <div className="shrink-0 border-t border-border p-3">
      {message && <p className="mb-2 text-sm text-destructive">{message}</p>}

      {file && !recorder.recording && (
        <div className="mb-2 flex w-fit max-w-full items-center gap-2 rounded-md border border-border bg-muted/60 px-2 py-1 text-sm">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">{file.name}</span>
          <IconButton label="Retirer le fichier" onClick={removeFile} className="p-0">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      {showEmojis && !recorder.recording && (
        <EmojiPicker emojis={EMOJIS} onSelect={(emoji) => setText(text + emoji)} className="mb-2" />
      )}

      {recorder.recording ? (
        <div className="flex items-center gap-3 rounded-full bg-muted/60 px-3 py-2">
          <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-destructive" />
          <span className="font-mono text-sm">{formatDuration(recorder.seconds)}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            Enregistrement en cours…
          </span>

          <IconButton
            label="Annuler l'enregistrement"
            onClick={recorder.cancel}
            className="p-0 hover:bg-transparent hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </IconButton>

          <button
            type="button"
            onClick={recorder.stop}
            aria-label="Envoyer le vocal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-2"
        >
          <input ref={fileInput} type="file" className="hidden" onChange={chooseFile} />

          <IconButton
            label="Joindre un fichier"
            onClick={() => fileInput.current?.click()}
            className="p-0 hover:bg-transparent"
          >
            <Paperclip className="h-5 w-5" />
          </IconButton>

          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholder}
            maxLength={4000}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <IconButton
            label="Choisir un emoji"
            onClick={() => setShowEmojis(!showEmojis)}
            className={cn("p-0 hover:bg-transparent", showEmojis && "text-primary")}
          >
            <Smile className="h-5 w-5" />
          </IconButton>

          {!hasDraft && (
            <IconButton
              label="Enregistrer un message vocal"
              onClick={startRecording}
              disabled={sending}
              className="p-0 hover:bg-transparent disabled:opacity-50"
            >
              <Mic className="h-5 w-5" />
            </IconButton>
          )}

          <button
            type="submit"
            disabled={sending || !hasDraft}
            aria-label="Envoyer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  )
}
