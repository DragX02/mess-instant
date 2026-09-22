"use client"

import { useRef, useState, type ChangeEvent, type RefObject, type SubmitEvent } from "react"
import { Paperclip, Send, Smile, X } from "lucide-react"
import { cn } from "cn"
import { api } from "@/lib/api"
import { EMOJIS } from "@/lib/emojis"
import { IconButton } from "@/components/ui/icon-button"
import { EmojiPicker } from "./emoji-picker"
import { launchBubble } from "./space/launch-bubble"
import { UserStar } from "./space/user-star"

const MAX_FILE_SIZE = 10 * 1024 * 1024

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
  /** Planète vers laquelle la bulle s'envole à l'envoi. */
  planetRef: RefObject<HTMLElement | null>
  onSent: () => void
}) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasDraft || sending) {
      return
    }

    const formData = new FormData()
    formData.append("content", text)
    if (file) {
      formData.append("file", file)
    }

    // L'envoi et le vol de la bulle vers la planète se déroulent en parallèle.
    const flight =
      bubbleRef.current && planetRef.current
        ? launchBubble(bubbleRef.current, planetRef.current)
        : Promise.resolve()

    setSending(true)
    setError("")
    const [result] = await Promise.all([
      api("/api/conversations/" + conversationId + "/messages", {
        method: "POST",
        body: formData,
      }),
      flight,
    ])
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
    <div className="relative shrink-0 px-3 pt-2 pb-3">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="relative">
          {/* Bulle de brouillon : grandit au-dessus de l'étoile pendant la saisie. */}
          {hasDraft && (
            <div
              ref={bubbleRef}
              className={cn(
                "absolute bottom-full left-2 mb-3 w-max max-w-[min(20rem,70vw)] animate-bubble-in rounded-2xl rounded-bl-sm border border-amber-200/40 bg-amber-100/15 px-3 py-2 text-sm text-white shadow-[0_0_24px_rgba(255,209,102,0.35)] backdrop-blur-md",
                sending && "invisible",
              )}
            >
              {text.trim() !== "" && (
                <p className="line-clamp-4 wrap-break-word whitespace-pre-wrap">{text}</p>
              )}
              {file && (
                <div className="mt-1 flex items-center gap-2 text-xs text-amber-100">
                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <IconButton
                    label="Retirer le fichier"
                    onClick={removeFile}
                    className="p-0 text-amber-100 hover:bg-transparent hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              )}
            </div>
          )}

          <UserStar name={userName} />
        </div>

        <div className="min-w-0 flex-1 pb-5">
          {error && <p className="mb-2 text-sm text-red-300">{error}</p>}

          {showEmojis && (
            <EmojiPicker
              emojis={EMOJIS}
              onSelect={(emoji) => setText(text + emoji)}
              className="mb-2"
            />
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-white backdrop-blur-md"
          >
            <input ref={fileInput} type="file" className="hidden" onChange={chooseFile} />

            <IconButton
              label="Joindre un fichier"
              onClick={() => fileInput.current?.click()}
              className="p-0 text-white/70 hover:bg-transparent hover:text-white"
            >
              <Paperclip className="h-5 w-5" />
            </IconButton>

            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
              maxLength={4000}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
            />

            <IconButton
              label="Choisir un emoji"
              onClick={() => setShowEmojis(!showEmojis)}
              className={cn(
                "p-0 text-white/70 hover:bg-transparent hover:text-white",
                showEmojis && "text-amber-200",
              )}
            >
              <Smile className="h-5 w-5" />
            </IconButton>

            <button
              type="submit"
              disabled={sending || !hasDraft}
              aria-label="Envoyer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
