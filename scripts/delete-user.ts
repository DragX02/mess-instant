import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function deleteUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log(`❌ Utilisateur avec email ${email} non trouvé`)
      process.exit(1)
    }

    // Supprimer l'utilisateur (les relations en cascade vont aussi être supprimées)
    const deleted = await prisma.user.delete({
      where: { email },
    })

    console.log(`✅ Utilisateur supprimé : ${deleted.email}`)
    console.log(`   ID: ${deleted.id}`)
    console.log(`   Créé le: ${deleted.createdAt}`)
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2] || "warse@live.fr"
deleteUser(email)
