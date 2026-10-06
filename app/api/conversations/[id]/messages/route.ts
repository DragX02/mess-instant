import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { CHAMPS_UTILISATEUR, canRead, canWrite, getCurrentUser, nomAffiche } from "@/lib/chat"
import { donnerPieces } from "@/lib/monnaie"
import { erreur, nonConnecte } from "@/lib/reponses"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || !(await canRead(conversation, user))) {
    return erreur("Conversation introuvable.", 404)
  }

  const lastMessages = await prisma.message.findMany({
    where: { conversationId: id },
    include: {
      sender: { select: CHAMPS_UTILISATEUR },
      reactions: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const messages = lastMessages.reverse().map((message) => {
    const reactions: { emoji: string; count: number; mine: boolean }[] = []

    for (const reaction of message.reactions) {
      const mine = user !== null && reaction.userId === user.id
      const found = reactions.find((item) => item.emoji === reaction.emoji)

      if (found) {
        found.count = found.count + 1
        found.mine = found.mine || mine
      } else {
        reactions.push({ emoji: reaction.emoji, count: 1, mine: mine })
      }
    }

    return {
      id: message.id,
      content: message.content,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileType: message.fileType,
      audioDuration: message.audioDuration,
      createdAt: message.createdAt,
      sender: { id: message.sender.id, name: nomAffiche(message.sender) },
      reactions: reactions,
    }
  })

  return Response.json({
    canWrite: await canWrite(conversation, user),
    messages: messages,
  })
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || !(await canWrite(conversation, user))) {
    return erreur("Vous ne pouvez pas écrire ici.", 403)
  }

  const formData = await request.formData()
  const content = String(formData.get("content") || "").trim()
  const file = formData.get("file")

  let fileUrl = null
  let fileName = null
  let fileType = null
  let audioDuration = null

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      return erreur("Le fichier dépasse 10 Mo.", 400)
    }

    const extension = path
      .extname(file.name)
      .replace(/[^a-zA-Z0-9.]/g, "")
      .slice(0, 10)
    const storedName = crypto.randomUUID() + extension
    const folder = path.join(process.cwd(), "uploads")

    await mkdir(folder, { recursive: true })
    await writeFile(path.join(folder, storedName), Buffer.from(await file.arrayBuffer()))

    fileUrl = "/api/fichiers/" + storedName
    fileName = file.name
    fileType = file.type || "application/octet-stream"

    if (fileType.startsWith("audio/")) {
      const duree = Number(formData.get("audioDuration"))

      if (Number.isFinite(duree) && duree >= 1 && duree <= 600) {
        audioDuration = Math.round(duree)
      }
    }
  }

  if (content === "" && !fileUrl) {
    return erreur("Le message est vide.", 400)
  }

  if (content.length > 4000) {
    return erreur("Le message est trop long.", 400)
  }

  const message = await prisma.message.create({
    data: {
      content: content,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      audioDuration: audioDuration,
      senderId: user.id,
      conversationId: id,
    },
  })

  await donnerPieces(user.id)

  return Response.json({ id: message.id })
}
