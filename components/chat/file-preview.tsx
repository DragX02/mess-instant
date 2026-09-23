import Image from "next/image"
import { Download, File } from "lucide-react"
import { cn } from "cn"
import { VoiceNote } from "./voice-note"

/** Affiche une pièce jointe selon son type : image, vidéo, audio, ou lien de téléchargement. */
export function FilePreview({
  url,
  name,
  type,
  audioDuration,
  tone = "sombre",
}: {
  url: string
  name: string
  type: string
  audioDuration?: number | null
  /** « sombre » sur les bulles de l'univers, « clair » dans l'interface classique. */
  tone?: "sombre" | "clair"
}) {
  const clair = tone === "clair"

  if (type.startsWith("image/") && type !== "image/svg+xml") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="mt-2 block w-fit">
        <Image
          src={url}
          alt={name}
          width={320}
          height={240}
          unoptimized
          className={cn(
            "h-auto max-h-64 w-auto max-w-full rounded-md border",
            clair ? "border-border" : "border-white/15",
          )}
        />
      </a>
    )
  }

  if (type.startsWith("video/")) {
    return <video src={url} controls className="mt-2 max-h-64 max-w-full rounded-md" />
  }

  if (type.startsWith("audio/")) {
    if (audioDuration) {
      return <VoiceNote url={url} duration={audioDuration} tone={tone} />
    }

    return <audio src={url} controls className="mt-2 max-w-full" />
  }

  return (
    <a
      href={url}
      className={cn(
        "mt-2 inline-flex max-w-full items-center gap-2 rounded-md border px-3 py-2 text-sm",
        clair
          ? "border-border bg-muted/60 hover:bg-muted"
          : "border-white/15 bg-black/20 hover:bg-black/30",
      )}
    >
      <File className="h-4 w-4 shrink-0" />
      <span className="truncate">{name}</span>
      <Download className="h-4 w-4 shrink-0 opacity-70" />
    </a>
  )
}
