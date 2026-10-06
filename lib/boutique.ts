export type Grade = {
  niveau: number
  nom: string
  maxServeurs: number
  prix: number
}

export type ThemeBoutique = {
  id: string
  nom: string
  detail: string
  prix: number
}

export const GRADES: Grade[] = [
  { niveau: 1, nom: "Bronze", maxServeurs: 1, prix: 0 },
  { niveau: 2, nom: "Argent", maxServeurs: 3, prix: 500 },
  { niveau: 3, nom: "Or", maxServeurs: 5, prix: 1500 },
]

export const THEMES_BOUTIQUE: ThemeBoutique[] = [
  {
    id: "classique",
    nom: "Classique",
    detail: "Liste de messages en colonne, comme une messagerie habituelle.",
    prix: 0,
  },
  {
    id: "univers",
    nom: "Univers",
    detail: "Navigation spatiale : les serveurs sont des galaxies et les canaux des planètes.",
    prix: 300,
  },
]

export const DUREE_GRADE_JOURS = 30
export const GAIN_PAR_ACTION = 1
export const LIMITE_PAR_JOUR = 200

const UN_JOUR = 24 * 60 * 60 * 1000

export function trouverGrade(niveau: number) {
  const grade = GRADES.find((item) => item.niveau === niveau)
  return grade || GRADES[0]
}

export function gradeActuel(grade: number, expiration: Date | null, maintenant = new Date()) {
  if (grade <= 1 || !expiration || expiration <= maintenant) {
    return 1
  }

  return grade
}

export function peutAcheterGrade(gradeActif: number, niveau: number) {
  const existe = GRADES.some((item) => item.niveau === niveau)
  return existe && niveau > 1 && niveau >= gradeActif
}

export function nouvelleExpiration(
  gradeActif: number,
  expiration: Date | null,
  niveau: number,
  maintenant = new Date(),
) {
  let debut = maintenant

  if (gradeActif === niveau && expiration && expiration > maintenant) {
    debut = expiration
  }

  return new Date(debut.getTime() + DUREE_GRADE_JOURS * UN_JOUR)
}

export function calculerGain(
  gagneAujourdhui: number,
  jourDuCompteur: string | null,
  maintenant = new Date(),
) {
  const jour = maintenant.toISOString().slice(0, 10)
  let deja = 0

  if (jourDuCompteur === jour) {
    deja = gagneAujourdhui
  }

  let gain = GAIN_PAR_ACTION

  if (deja >= LIMITE_PAR_JOUR) {
    gain = 0
  }

  return { gain: gain, gagneAujourdhui: deja + gain, jour: jour }
}
