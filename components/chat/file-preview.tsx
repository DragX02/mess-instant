import Image from "next/image"
import { Download, File } from "lucide-react"

/** Affiche une pièce jointe selon son type : image, vidéo, audio, ou lien de téléchargement. */
export function FilePreview({ url, name, type }: { url: string; name: string; type: string }) {
  if (type.startsWith("image/") && type !== "image/svg+xml") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="mt-2 block w-fit">
        <Image
          src={url}
          alt={name}
          width={320}
          height={240}
          unoptimized
          className="h-auto max-h-64 w-auto max-w-full rounded-md border border-border"
        />
      </a>
    )
  }

  if (type.startsWith("video/")) {
    return <video src={url} controls className="mt-2 max-h-64 max-w-full rounded-md" />
  }

  if (type.startsWith("audio/")) {
    return <audio src={url} controls className="mt-2 max-w-full" />
  }

  return (
    <a
      href={url}
      className="mt-2 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm hover:bg-muted"
    >
      <File className="h-4 w-4 shrink-0" />
      <span className="truncate">{name}</span>
      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  )
}
