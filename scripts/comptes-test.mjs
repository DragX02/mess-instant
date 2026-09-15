import { PrismaClient } from "@prisma/client"
import { generateRandomString, hashPassword } from "better-auth/crypto"

const prisma = new PrismaClient()

const MOT_DE_PASSE = "test1234"

const comptes = [
  { name: "Test Admin", email: "test@helix.local", isAdmin: true },
  { name: "Test User", email: "test2@helix.local", isAdmin: false },
]

for (const compte of comptes) {
  const hash = await hashPassword(MOT_DE_PASSE)

  let user = await prisma.user.findUnique({ where: { email: compte.email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: compte.name,
        email: compte.email,
        emailVerified: true,
        isAdmin: compte.isAdmin,
      },
    })
  } else {
    await prisma.user.update({ where: { id: user.id }, data: { isAdmin: compte.isAdmin } })
  }

  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  })

  if (account) {
    await prisma.account.update({ where: { id: account.id }, data: { password: hash } })
  } else {
    await prisma.account.create({
      data: {
        id: generateRandomString(32),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hash,
      },
    })
  }

  console.log("Compte prêt : " + compte.email + " / " + MOT_DE_PASSE)
}

await prisma.$disconnect()
