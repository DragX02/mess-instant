"use client"

import { useEffect, useRef, useState } from "react"

const MAX_SECONDS = 120

function choisirFormat() {
  if (typeof MediaRecorder === "undefined") {
    return null
  }

  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return { mimeType: "audio/webm;codecs=opus", extension: ".webm" }
  }

  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return { mimeType: "audio/webm", extension: ".webm" }
  }

  if (MediaRecorder.isTypeSupported("audio/mp4")) {
    return { mimeType: "audio/mp4", extension: ".m4a" }
  }

  return null
}

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState("")

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countRef = useRef(0)
  const keepRef = useRef(true)
  const finishRef = useRef<(file: File, seconds: number) => void>(() => {})

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        keepRef.current = false
        recorderRef.current.stop()
      }
    }
  }, [])

  async function start(onFinish: (file: File, seconds: number) => void) {
    setError("")

    if (recorderRef.current) {
      return
    }

    if (!window.isSecureContext || !navigator.mediaDevices) {
      setError("L'enregistrement demande une connexion sécurisée (https ou localhost).")
      return
    }

    const format = choisirFormat()

    if (!format) {
      setError("Votre navigateur ne sait pas enregistrer de son.")
      return
    }

    let stream: MediaStream

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (erreur) {
      const nom = erreur instanceof Error ? erreur.name : ""

      if (nom === "NotAllowedError") {
        setError("Accès au micro refusé.")
      } else if (nom === "NotFoundError") {
        setError("Aucun micro détecté.")
      } else {
        setError("Impossible de démarrer l'enregistrement.")
      }

      return
    }

    const recorder = new MediaRecorder(stream, { mimeType: format.mimeType })

    chunksRef.current = []
    countRef.current = 0
    keepRef.current = true
    finishRef.current = onFinish

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop())

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      recorderRef.current = null
      setRecording(false)

      if (!keepRef.current || chunksRef.current.length === 0) {
        return
      }

      const blob = new Blob(chunksRef.current, { type: format.mimeType })
      const file = new File([blob], "vocal-" + Date.now() + format.extension, {
        type: format.mimeType,
      })

      finishRef.current(file, Math.max(1, countRef.current))
    }

    recorder.start()
    recorderRef.current = recorder
    setSeconds(0)
    setRecording(true)

    timerRef.current = setInterval(() => {
      countRef.current = countRef.current + 1
      setSeconds(countRef.current)

      if (countRef.current >= MAX_SECONDS) {
        stop()
      }
    }, 1000)
  }

  function stop() {
    keepRef.current = true
    recorderRef.current?.stop()
  }

  function cancel() {
    keepRef.current = false
    recorderRef.current?.stop()
  }

  return { recording, seconds, error, start, stop, cancel }
}
