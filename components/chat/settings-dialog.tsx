"use client"

import { useState } from "react"
import { Check, MessagesSquare, Orbit } from "lucide-react"
import { cn } from "cn"
import type { UiTheme } from "@/hooks/use-ui-theme"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

const THEMES: { id: UiTheme; name: string; detail: string; icon: React.ReactNode }[] = [
  {
    id: "classique",
    name: "Classique",
    detail: "Liste de messages en colonne, comme une messagerie habituelle.",
    icon: <MessagesSquare className="h-5 w-5" />,
  },
  {
    id: "univers",
    name: "Univers",
    detail: "Navigation spatiale : les serveurs sont des galaxies et les canaux des planètes.",
    icon: <Orbit className="h-5 w-5" />,
  },
]

export function SettingsDialog({
  current,
  owned,
  onApply,
  onClose,
}: {
  current: UiTheme
  owned: string[]
  onApply: (theme: UiTheme) => void
  onClose: () => void
}) {
  const [choice, setChoice] = useState<UiTheme>(current)

  return (
    <Modal title="Paramètres" onClose={onClose}>
      <p className="mb-3 text-sm font-medium">Thème de l&apos;interface</p>

      <div className="flex flex-col gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            disabled={!owned.includes(theme.id)}
            onClick={() => setChoice(theme.id)}
            aria-pressed={choice === theme.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              choice === theme.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted/60",
            )}
          >
            <span className="mt-0.5 shrink-0 text-primary">{theme.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-sm font-medium">
                {theme.name}
                {current === theme.id && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
                    actuel
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{theme.detail}</span>
              {!owned.includes(theme.id) && (
                <span className="mt-1 block text-xs text-primary">À acheter dans la boutique</span>
              )}
            </span>
            {choice === theme.id && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Le thème est enregistré dans ce navigateur. Sur un autre appareil, il faudra le réinstaller.
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          disabled={choice === current}
          onClick={() => {
            onApply(choice)
            onClose()
          }}
        >
          Installer et appliquer
        </Button>
      </div>
    </Modal>
  )
}
