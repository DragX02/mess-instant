"use client"

import { useState, type ChangeEvent, type SubmitEvent } from "react"
import { api } from "@/lib/api"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function useMessageDraft(
  conversationId: string,
  onSent: () => void,
  animation?: () => Promise<void>,
) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [vocalSeconds, setVocalSeconds] = useState(0)
  const recorder = useAudioRecorder()

  const hasDraft = text.trim() !== "" || file !== null

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0] ?? null
    event.target.value = ""

    if (chosen && chosen.size > MAX_FILE_SIZE) {
      setError("Le fichier dépasse 10 Mo.")
      return
    }

    setError("")
    setFile(chosen)
  }

  function removeFile() {
    setFile(null)
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

    const flight = animation ? animation() : Promise.resolve()

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
    setVocalSeconds(0)

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

      setVocalSeconds(seconds)
      send("", vocal, seconds)
    })
  }

  return {
    text,
    setText,
    file,
    showEmojis,
    setShowEmojis,
    sending,
    hasDraft,
    vocalSeconds,
    recorder,
    message: error || recorder.error,
    chooseFile,
    removeFile,
    handleSubmit,
    startRecording,
  }
}

export type MessageDraft = ReturnType<typeof useMessageDraft>
