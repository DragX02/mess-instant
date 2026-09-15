"use client"

import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react"
import { Paperclip, Send, Smile, X } from "lucide-react"
import { cn } from "cn"
import { api } from "@/lib/api"
import { EMOJIS } from "@/lib/emojis"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function MessageForm({
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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (text.trim() === "" && !file) {
      return
    }

    const formData = new FormData()
    formData.append("content", text)
    if (file) {
      formData.append("file", file)
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

  return (
    <div className="shrink-0 border-t border-border p-3">
      {error && <p className="mb-2 text-sm text-destructive">{error}</p>}

      {file && (
        <div className="mb-2 flex w-fit max-w-full items-center gap-2 rounded-md border border-border bg-muted/60 px-2 py-1 text-sm">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">{file.name}</span>
          <IconButton label="Retirer le fichier" onClick={removeFile} className="p-0">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      )}

      {showEmojis && (
        <EmojiPicker
          emojis={EMOJIS}
          onSelect={(emoji) => setText(text + emoji)}
          className="mb-2"
        />
      )}

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

        <button
          type="submit"
          disabled={sending}
          aria-label="Envoyer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
