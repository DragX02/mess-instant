import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/chat"
import {
  GRADES,
  PACKS,
  THEMES_BOUTIQUE,
  gradeActuel,
  nouvelleExpiration,
  peutAcheterGrade,
  trouverGrade,
} from "@/lib/boutique"
import { erreur, nonConnecte, ok } from "@/lib/reponses"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const grade = gradeActuel(user.grade, user.gradeExpiresAt)
  const serversCreated = await prisma.server.count({ where: { createdById: user.id } })

  return Response.json({
    coins: user.coins,
    grade: grade,
    gradeExpiresAt: grade > 1 ? user.gradeExpiresAt : null,
    ownedThemes: user.ownedThemes,
    serversCreated: serversCreated,
    maxServers: trouverGrade(grade).maxServeurs,
  })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return nonConnecte()
  }

  const body = await request.json()

  if (body.type === "grade") {
    const grade = GRADES.find((item) => item.niveau === body.niveau)
    const actif = gradeActuel(user.grade, user.gradeExpiresAt)

    if (!grade || !peutAcheterGrade(actif, grade.niveau)) {
      return erreur("Vous ne pouvez pas acheter ce grade.", 400)
    }

    const resultat = await prisma.user.updateMany({
      where: { id: user.id, coins: { gte: grade.prix } },
      data: {
        coins: { decrement: grade.prix },
        grade: grade.niveau,
        gradeExpiresAt: nouvelleExpiration(actif, user.gradeExpiresAt, grade.niveau),
      },
    })

    if (resultat.count === 0) {
      return erreur("Pas assez de pièces.", 400)
    }

    return ok()
  }

  if (body.type === "theme") {
    const theme = THEMES_BOUTIQUE.find((item) => item.id === body.id)

    if (!theme) {
      return erreur("Thème introuvable.", 400)
    }

    if (user.ownedThemes.includes(theme.id)) {
      return erreur("Vous avez déjà ce thème.", 400)
    }

    const resultat = await prisma.user.updateMany({
      where: {
        id: user.id,
        coins: { gte: theme.prix },
        NOT: { ownedThemes: { has: theme.id } },
      },
      data: {
        coins: { decrement: theme.prix },
        ownedThemes: { push: theme.id },
      },
    })

    if (resultat.count === 0) {
      return erreur("Pas assez de pièces.", 400)
    }

    return ok()
  }

  if (body.type === "pack") {
    const pack = PACKS.find((item) => item.id === body.id)

    if (!pack) {
      return erreur("Pack introuvable.", 400)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { coins: { increment: pack.pieces } },
    })

    return ok()
  }

  return erreur("Achat invalide.", 400)
}
