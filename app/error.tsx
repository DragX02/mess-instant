"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { StatusPage } from "@/components/status-page"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Erreur non gérée:", error)
  }, [error])

  return (
    <StatusPage
      symbol="⚠️"
      symbolClassName="text-destructive"
      title="Oups ! Une erreur s'est produite"
      description="Nous avons rencontré un problème inattendu. Notre équipe a été notifiée et travaille à la résolution."
    >
      {error.digest && (
        <div className="p-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground break-all">
          ID: <span className="font-mono">{error.digest}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button onClick={reset} className="w-full">
          Réessayer
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Retour à l&apos;accueil
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Problème persistant ?{" "}
        <a href="mailto:hello@helix.app" className="text-primary hover:underline">
          Contacter le support
        </a>
      </p>
    </StatusPage>
  )
}
