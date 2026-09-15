"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Paperclip, Send, Smile, X } from "lucide-react"

const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "😘",
  "😎",
  "🤔",
  "😅",
  "😢",
  "😭",
  "😡",
  "😱",
  "🥳",
  "😴",
  "👍",
  "👎",
  "👏",
  "🙏",
  "💪",
  "👋",
  "🤝",
  "✌️",
  "❤️",
  "💔",
  "🔥",
  "✨",
  "🎉",
  "🎁",
  "💯",
  "✅",
  "❌",
  "⚠️",
  "☕",
  "🍕",
  "🍺",
  "⚽",
  "🎮",
  "🚀",
]

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
    const chosen = event.target.files ? event.target.files[0] : null

    if (chosen && chosen.size > MAX_FILE_SIZE) {
      setError("Le fichier dépasse 10 Mo.")
      event.target.value = ""
      return
    }

    setError("")
    setFile(chosen || null)
  }

  function removeFile() {
    setFile(null)
    if (fileInput.current) {
      fileInput.current.value = ""
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (text.trim() === "" && !file) {
      return
    }

    setSending(true)
    setError("")

    const formData = new FormData()
    formData.append("content", text)
    if (file) {
      formData.append("file", file)
    }

    const response = await fetch("/api/conversations/" + conversationId + "/messages", {
      method: "POST",
      body: formData,
    })

    setSending(false)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setError(data.error || "Erreur lors de l'envoi du message.")
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
          <button onClick={removeFile} aria-label="Retirer le fichier">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showEmojis && (
        <div className="mb-2 grid grid-cols-8 gap-1 rounded-lg border border-border bg-card p-2 sm:grid-cols-10">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setText(text + emoji)}
              className="rounded p-1 text-xl hover:bg-muted"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-2"
      >
        <input ref={fileInput} type="file" className="hidden" onChange={chooseFile} />

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          aria-label="Joindre un fichier"
          className="text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          maxLength={4000}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          aria-label="Choisir un emoji"
          className={showEmojis ? "text-primary" : "text-muted-foreground hover:text-foreground"}
        >
          <Smile className="h-5 w-5" />
        </button>

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
