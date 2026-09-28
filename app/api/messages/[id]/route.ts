import { unlink } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"
import { canManageServer, getCurrentUser } from "@/lib/chat"
import { erreur, nonConnecte, ok } from "@/lib/reponses"

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const message = await prisma.message.findUnique({
    where: { id },
    include: { conversation: { select: { serverId: true } } },
  })

  if (!message) {
    return erreur("Message introuvable.", 404)
  }

  const serverId = message.conversation.serverId
  const moderator = serverId ? await canManageServer(user, serverId) : user.isAdmin

  if (message.senderId !== user.id && !moderator) {
    return erreur("Vous ne pouvez supprimer que vos messages.", 403)
  }

  await prisma.message.delete({ where: { id } })

  if (message.fileUrl) {
    const storedName = message.fileUrl.replace("/api/fichiers/", "")
    try {
      await unlink(path.join(process.cwd(), "uploads", storedName))
    } catch {}
  }

  return ok()
}
