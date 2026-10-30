import { describe, it, expect } from "vitest"
import {
  GRADES,
  LIMITE_PAR_JOUR,
  PACKS,
  THEMES_BOUTIQUE,
  calculerGain,
  formaterPrix,
  gradeActuel,
  nouvelleExpiration,
  peutAcheterGrade,
  prixPack,
  trouverGrade,
} from "@/lib/boutique"

const MAINTENANT = new Date("2026-10-06T12:00:00Z")
const UN_JOUR = 24 * 60 * 60 * 1000

describe("grades", () => {
  it("donne 1, 3 et 5 serveurs selon le grade", () => {
    expect(GRADES.map((grade) => grade.maxServeurs)).toEqual([1, 3, 5])
  })

  it("le grade 1 est gratuit, les autres sont payants", () => {
    expect(trouverGrade(1).prix).toBe(0)
    expect(trouverGrade(2).prix).toBeGreaterThan(0)
    expect(trouverGrade(3).prix).toBeGreaterThan(trouverGrade(2).prix)
  })

  it("retombe au grade 1 pour un niveau inconnu", () => {
    expect(trouverGrade(42).niveau).toBe(1)
  })
})

describe("gradeActuel", () => {
  it("garde le grade tant qu'il n'est pas expiré", () => {
    const expiration = new Date(MAINTENANT.getTime() + UN_JOUR)
    expect(gradeActuel(3, expiration, MAINTENANT)).toBe(3)
  })

  it("retombe au grade 1 quand le grade est expiré", () => {
    const expiration = new Date(MAINTENANT.getTime() - UN_JOUR)
    expect(gradeActuel(3, expiration, MAINTENANT)).toBe(1)
  })

  it("retombe au grade 1 sans date d'expiration", () => {
    expect(gradeActuel(2, null, MAINTENANT)).toBe(1)
  })
})

describe("peutAcheterGrade", () => {
  it("autorise un grade supérieur ou le même grade", () => {
    expect(peutAcheterGrade(1, 2)).toBe(true)
    expect(peutAcheterGrade(2, 2)).toBe(true)
    expect(peutAcheterGrade(2, 3)).toBe(true)
  })

  it("refuse un grade inférieur, le grade 1 et un grade inconnu", () => {
    expect(peutAcheterGrade(3, 2)).toBe(false)
    expect(peutAcheterGrade(1, 1)).toBe(false)
    expect(peutAcheterGrade(1, 4)).toBe(false)
  })
})

describe("nouvelleExpiration", () => {
  it("donne 30 jours à partir de maintenant pour un nouveau grade", () => {
    const resultat = nouvelleExpiration(1, null, 2, MAINTENANT)
    expect(resultat.getTime()).toBe(MAINTENANT.getTime() + 30 * UN_JOUR)
  })

  it("ajoute 30 jours à la fin actuelle quand on prolonge le même grade", () => {
    const fin = new Date(MAINTENANT.getTime() + 10 * UN_JOUR)
    const resultat = nouvelleExpiration(2, fin, 2, MAINTENANT)
    expect(resultat.getTime()).toBe(fin.getTime() + 30 * UN_JOUR)
  })

  it("repart de maintenant quand on passe à un grade supérieur", () => {
    const fin = new Date(MAINTENANT.getTime() + 10 * UN_JOUR)
    const resultat = nouvelleExpiration(2, fin, 3, MAINTENANT)
    expect(resultat.getTime()).toBe(MAINTENANT.getTime() + 30 * UN_JOUR)
  })
})

describe("calculerGain", () => {
  it("donne 1 pièce pour une action", () => {
    expect(calculerGain(0, "2026-10-06", MAINTENANT)).toEqual({
      gain: 1,
      gagneAujourdhui: 1,
      jour: "2026-10-06",
    })
  })

  it("ne donne plus rien après la limite du jour", () => {
    const resultat = calculerGain(LIMITE_PAR_JOUR, "2026-10-06", MAINTENANT)
    expect(resultat.gain).toBe(0)
    expect(resultat.gagneAujourdhui).toBe(LIMITE_PAR_JOUR)
  })

  it("remet le compteur à zéro le lendemain", () => {
    const resultat = calculerGain(LIMITE_PAR_JOUR, "2026-10-05", MAINTENANT)
    expect(resultat).toEqual({ gain: 1, gagneAujourdhui: 1, jour: "2026-10-06" })
  })
})

describe("thèmes de la boutique", () => {
  it("le thème classique est gratuit et le thème univers est payant", () => {
    const classique = THEMES_BOUTIQUE.find((theme) => theme.id === "classique")
    const univers = THEMES_BOUTIQUE.find((theme) => theme.id === "univers")
    expect(classique?.prix).toBe(0)
    expect(univers?.prix).toBeGreaterThan(0)
  })
})

describe("packs de pièces", () => {
  it("propose 3 packs de 499, 1499 et 3000 pièces", () => {
    expect(PACKS.map((pack) => pack.pieces)).toEqual([499, 1499, 3000])
  })

  it("applique 15 % de réduction sur le dernier pack", () => {
    expect(prixPack(PACKS[0])).toBe(499)
    expect(prixPack(PACKS[1])).toBe(1499)
    expect(prixPack(PACKS[2])).toBe(2550)
  })

  it("affiche le prix en euros", () => {
    expect(formaterPrix(499)).toBe("4,99 €")
    expect(formaterPrix(2550)).toBe("25,50 €")
  })
})
