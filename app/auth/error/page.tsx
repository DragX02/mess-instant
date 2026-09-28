"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { translateError } from "@/lib/error-messages"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth"

const TITLES: Record<string, string> = {
  access_denied: "Authentification annulée",
  invalid_request: "Requête invalide",
  server_error: "Erreur serveur",
  temporarily_unavailable: "Service indisponible",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const message = error
    ? translateError(errorDescription || error)
    : "Une erreur s'est produite lors de l'authentification."

  return (
    <AuthCard
      title={(error && TITLES[error]) || "Erreur d'authentification"}
      description="Une erreur s'est produite lors de la connexion."
      titleClassName="text-destructive"
    >
      <div className="space-y-6">
        <Alert className="p-4">{message}</Alert>

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
            S&apos;inscrire
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Besoin d&apos;aide ?{" "}
          <a href="mailto:hello@helix.app" className="text-primary hover:underline">
            Contacter le support
          </a>
        </p>
      </div>
    </AuthCard>
  )
}
