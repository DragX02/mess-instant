"use client"

import { useState } from "react"
import { Coins, Crown } from "lucide-react"
import { api } from "@/lib/api"
import { DUREE_GRADE_JOURS, GRADES, PACKS, THEMES_BOUTIQUE, trouverGrade } from "@/lib/boutique"
import type { Portefeuille } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { PackCard } from "@/components/pack-card"

export function BoutiqueDialog({
  portefeuille,
  onClose,
  onChange,
}: {
  portefeuille: Portefeuille
  onClose: () => void
  onChange: () => void
}) {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [enCours, setEnCours] = useState(false)
  const grade = trouverGrade(portefeuille.grade)

  async function acheter(body: Record<string, unknown>, nom: string) {
    setEnCours(true)
    setError("")
    setMessage("")

    const result = await api<{ ok: boolean }>("/api/boutique", { method: "POST", body })

    setEnCours(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setMessage(nom + " acheté !")
    onChange()
  }

  return (
    <Modal title="Boutique" onClose={onClose}>
      <div className="mb-4 rounded-lg border border-border bg-muted/40 p-3">
        <p className="flex items-center gap-2 text-lg font-semibold">
          <Coins className="h-5 w-5 text-primary" />
          <span>{portefeuille.coins} pièces</span>
        </p>
        <p className="mt-1 text-sm">
          Grade actuel : {grade.nom}
          {portefeuille.gradeExpiresAt &&
            " (jusqu'au " + new Date(portefeuille.gradeExpiresAt).toLocaleDateString("fr-FR") + ")"}
        </p>
        <p className="text-sm text-muted-foreground">
          Serveurs créés : {portefeuille.serversCreated} / {portefeuille.maxServers}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Gagnez 1 pièce par message envoyé et par réaction (200 par jour maximum).
        </p>
      </div>

      <p className="mb-2 text-sm font-medium">Packs de pièces</p>
      <div className="mb-2 flex flex-col gap-4 pt-2">
        {PACKS.map((pack) => (
          <PackCard key={pack.id} pack={pack} compact>
            <Button
              size="sm"
              aria-label={"Acheter le pack " + pack.nom}
              disabled={enCours}
              onClick={() =>
                acheter(
                  { type: "pack", id: pack.id },
                  "Pack " + pack.nom + " (" + pack.pieces + " pièces)",
                )
              }
            >
              Acheter
            </Button>
          </PackCard>
        ))}
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Achat fictif pour la démonstration : aucun paiement réel.
      </p>

      <p className="mb-2 text-sm font-medium">Grades</p>
      <div className="mb-4 flex flex-col gap-2">
        {GRADES.map((item) => {
          const actuel = item.niveau === portefeuille.grade
          const label = actuel ? "Prolonger" : "Acheter"

          return (
            <div
              key={item.niveau}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <Crown className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  {item.nom}
                  {actuel && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
                      actuel
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Jusqu&apos;à {item.maxServeurs} serveur{item.maxServeurs > 1 ? "s" : ""}
                  {item.prix > 0 && " · " + item.prix + " pièces / " + DUREE_GRADE_JOURS + " jours"}
                </p>
              </div>
              {item.prix > 0 && (
                <Button
                  size="sm"
                  aria-label={label + " le grade " + item.nom}
                  disabled={
                    enCours || item.niveau < portefeuille.grade || portefeuille.coins < item.prix
                  }
                  onClick={() => acheter({ type: "grade", niveau: item.niveau }, item.nom)}
                >
                  {label}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      <p className="mb-2 text-sm font-medium">Thèmes</p>
      <div className="flex flex-col gap-2">
        {THEMES_BOUTIQUE.map((theme) => {
          const possede = portefeuille.ownedThemes.includes(theme.id)

          return (
            <div
              key={theme.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{theme.nom}</p>
                <p className="text-xs text-muted-foreground">
                  {theme.prix > 0 ? theme.prix + " pièces" : "Gratuit"}
                </p>
              </div>
              {possede ? (
                <span className="text-xs text-muted-foreground">Possédé</span>
              ) : (
                <Button
                  size="sm"
                  aria-label={"Acheter le thème " + theme.nom}
                  disabled={enCours || portefeuille.coins < theme.prix}
                  onClick={() => acheter({ type: "theme", id: theme.id }, "Thème " + theme.nom)}
                >
                  Acheter
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-3 text-sm text-primary">{message}</p>}
    </Modal>
  )
}
