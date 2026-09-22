"use client"

import { useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { formatDuration } from "@/lib/format"

export function VoiceNote({ url, duration }: { url: string; duration: number }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)

  function toggle() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  const percent = Math.min(100, (current / duration) * 100)

  return (
    <div className="mt-2 flex w-fit max-w-full items-center gap-3 rounded-full border border-white/15 bg-black/20 px-3 py-2">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false)
          setCurrent(0)
        }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mettre en pause" : "Lire le message vocal"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      <div className="h-1 w-32 shrink-0 overflow-hidden rounded-full bg-white/20 sm:w-40">
        <div className="h-full rounded-full bg-amber-200" style={{ width: percent + "%" }} />
      </div>

      <span className="shrink-0 font-mono text-xs opacity-70">
        {formatDuration(current > 0 ? current : duration)}
      </span>
    </div>
  )
}
