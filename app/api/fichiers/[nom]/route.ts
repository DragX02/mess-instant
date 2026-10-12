import { readFile } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { canRead, getCurrentUser } from "@/lib/chat"
import { nomFichierValide } from "@/lib/validation-url"

export async function GET(request: Request, ctx: { params: Promise<{ nom: string }> }) {
  const { nom } = await ctx.params

  if (!nomFichierValide(nom)) {
    return new Response("Fichier introuvable", { status: 404 })
  }

  const message = await prisma.message.findFirst({
    where: { fileUrl: "/api/fichiers/" + nom },
    include: { conversation: true },
  })

  const user = await getCurrentUser()

  if (!message || !(await canRead(message.conversation, user))) {
    return new Response("Fichier introuvable", { status: 404 })
  }

  let data
  try {
    data = await readFile(path.join(process.cwd(), "uploads", nom))
  } catch {
    return new Response("Fichier introuvable", { status: 404 })
  }

  const type = message.fileType || "application/octet-stream"
  const isMedia =
    (type.startsWith("image/") && type !== "image/svg+xml") ||
    type.startsWith("video/") ||
    type.startsWith("audio/")

  const fileName = encodeURIComponent(message.fileName || nom)

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": isMedia ? type : "application/octet-stream",
      "Content-Disposition": (isMedia ? "inline" : "attachment") + "; filename*=UTF-8''" + fileName,
      "X-Content-Type-Options": "nosniff",
    },
  })
}
