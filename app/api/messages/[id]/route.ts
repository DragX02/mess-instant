import { unlink } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/chat"

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Vous devez être connecté." }, { status: 401 })
  }

  const message = await prisma.message.findUnique({ where: { id } })

  if (!message) {
    return Response.json({ error: "Message introuvable." }, { status: 404 })
  }
  if (message.senderId !== user.id && !user.isAdmin) {
    return Response.json({ error: "Vous ne pouvez supprimer que vos messages." }, { status: 403 })
  }

  await prisma.message.delete({ where: { id } })

  if (message.fileUrl) {
    const storedName = message.fileUrl.replace("/api/fichiers/", "")
    try {
      await unlink(path.join(process.cwd(), "uploads", storedName))
    } catch {}
  }

  return Response.json({ ok: true })
}
