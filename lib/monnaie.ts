import { calculerGain } from "@/lib/boutique"
import { prisma } from "@/lib/prisma"

export async function donnerPieces(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return 0
  }

  const resultat = calculerGain(user.coinsEarnedToday, user.coinsDay)

  if (resultat.gain === 0) {
    return 0
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      coins: { increment: resultat.gain },
      coinsEarnedToday: resultat.gagneAujourdhui,
      coinsDay: resultat.jour,
    },
  })

  return resultat.gain
}
