import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { canRead, canWrite, getCurrentUser } from "@/lib/chat"

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || !(await canRead(conversation, user))) {
    return Response.json({ error: "Conversation introuvable." }, { status: 404 })
  }

  const lastMessages = await prisma.message.findMany({
    where: { conversationId: id },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      reactions: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const messages = lastMessages.reverse().map((message) => {
    const reactions: { emoji: string; count: number; mine: boolean }[] = []

    for (const reaction of message.reactions) {
      const found = reactions.find((item) => item.emoji === reaction.emoji)
      if (found) {
        found.count = found.count + 1
        if (user && reaction.userId === user.id) {
          found.mine = true
        }
      } else {
        reactions.push({
          emoji: reaction.emoji,
          count: 1,
          mine: user !== null && reaction.userId === user.id,
        })
      }
    }

    return {
      id: message.id,
      content: message.content,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      fileType: message.fileType,
      createdAt: message.createdAt,
      sender: { id: message.sender.id, name: message.sender.name || message.sender.email },
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
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } })

  if (!conversation || !(await canWrite(conversation, user))) {
    return Response.json({ error: "Vous ne pouvez pas écrire ici." }, { status: 403 })
  }

  const formData = await request.formData()
  const content = String(formData.get("content") || "").trim()
  const file = formData.get("file")

  let fileUrl = null
  let fileName = null
  let fileType = null

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Le fichier dépasse 10 Mo." }, { status: 400 })
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
  }

  if (content === "" && !fileUrl) {
    return Response.json({ error: "Le message est vide." }, { status: 400 })
  }

  if (content.length > 4000) {
    return Response.json({ error: "Le message est trop long." }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      content: content,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      senderId: user.id,
      conversationId: id,
    },
  })

  return Response.json({ id: message.id })
}
