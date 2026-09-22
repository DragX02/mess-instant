"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="max-w-md text-center space-y-8">
        <Logo href="/" full className="flex justify-center mb-8" />

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-destructive">⚠️</h1>
          <h2 className="text-2xl font-bold">Oups ! Une erreur s'est produite</h2>
          <p className="text-muted-foreground">
            Nous avons rencontré un problème inattendu. Notre équipe a été notifiée et
            travaille à la résolution.
          </p>
        </div>

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
            Retour à l'accueil
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Problème persistant ?{" "}
          <a href="mailto:hello@helix.app" className="text-primary hover:underline">
            Contacter le support
          </a>
        </p>
      </div>
    </div>
  )
}
