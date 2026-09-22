"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { translateError } from "@/lib/error-messages"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const errorMessage = error
    ? translateError(errorDescription || error)
    : "Une erreur s'est produite lors de l'authentification."

  const errorTitles: Record<string, string> = {
    access_denied: "Authentification annulée",
    invalid_request: "Requête invalide",
    server_error: "Erreur serveur",
    temporarily_unavailable: "Service indisponible",
  }

  const title = errorTitles[error as string] || "Erreur d'authentification"

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-16">
      <Card className="w-full max-w-md rounded-[var(--radius)]">
        <CardHeader className="flex flex-col items-center pt-8">
          <Logo href="/" full className="mb-6" />
          <CardTitle className="text-2xl text-destructive">{title}</CardTitle>
          <CardDescription>Une erreur s'est produite lors de la connexion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[var(--radius)] border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>

          <div className="space-y-3">
            <Button nativeButton={false} render={<Link href="/auth/connexion" />} className="w-full">
              Retour à la connexion
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/auth/inscription" />}
              variant="outline"
              className="w-full"
            >
              S'inscrire
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Besoin d'aide ?{" "}
            <a href="mailto:hello@helix.app" className="text-primary hover:underline">
              Contacter le support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
